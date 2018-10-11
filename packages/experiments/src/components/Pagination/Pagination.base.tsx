import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { BaseComponent, classNamesFunction } from '../../Utilities';
import { PageNumber } from './PageNumber';
import { IPaginationProps, IPaginationStyleProps, IPaginationStyles } from './Pagination.types';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';

const getClassNames = classNamesFunction<IPaginationStyleProps, IPaginationStyles>();

export class PaginationBase extends BaseComponent<IPaginationProps, {}> {
  public static defaultProps: Partial<IPaginationProps> = {
    nextLabel: '>>',
    previousLabel: '<<',
    selectedPageIndex: 0,
    pageRange: 2,
    marginPages: 1,
    omissionLabel: '...',
    withComboBox: false
  };

  private _classNames: { [key in keyof IPaginationStyles]: string };
  private scaleOptions: IComboBoxOption[] = [];

  constructor(props: IPaginationProps) {
    super(props);

    for (let i = 0; i < this.props.pageCount; i++) {
      this.scaleOptions.push({
        key: `${i}`,
        text: `${i + 1}`
      });
    }
  }

  public render(): JSX.Element {
    const {
      nextAriaLabel,
      nextLabel,
      pageCount,
      previousAriaLabel,
      previousLabel,
      selectedPageIndex,
      withComboBox,
      styles,
      theme
    } = this.props;

    this._classNames = getClassNames(styles!, {
      theme: theme!
    });

    const canPrevious = selectedPageIndex! > 0;
    const canNext = selectedPageIndex! + 1 < pageCount;
    const canFirst = selectedPageIndex !== 0;
    const canLast = selectedPageIndex !== pageCount - 1;

    if (withComboBox) {
      return (
        <ul className={this._classNames.root} role="tablist">
          <IconButton iconProps={{ iconName: 'DoubleChevronLeft' }} onClick={this.handleFirstPage} disabled={!canFirst} role="tab" />
          <IconButton
            iconProps={{ iconName: 'ChevronLeft' }}
            onClick={this.handlePreviousPage}
            disabled={!canPrevious}
            role="tab"
            aria-label={previousAriaLabel}
          />
          <ComboBox
            selectedKey={`${selectedPageIndex}`}
            options={this.scaleOptions}
            onChanged={this.onComboBoxChanged}
            styles={{
              container: this._classNames.comboBox
            }}
          />
          <span>{` of ${pageCount}`}</span>
          <IconButton
            iconProps={{ iconName: 'ChevronRight' }}
            onClick={this.handleNextPage}
            disabled={!canNext}
            role="tab"
            aria-label={nextAriaLabel}
          />
          <IconButton iconProps={{ iconName: 'DoubleChevronRight' }} onClick={this.handleLastPage} disabled={!canLast} role="tab" />
        </ul>
      );
    }

    // FocusZone handles A11Y requirement such as:
    // Dynamically set tabindex (0 or -1) to the correct item
    // Refocus to the active item when component re-renders
    // Handles all key strokes, e.g., left/right, space, enter
    return (
      <FocusZone direction={FocusZoneDirection.horizontal}>
        <ul className={this._classNames.root} role="tablist">
          <li key="previousPage">
            <button
              className={this._classNames.previousNextPage}
              onClick={this.handlePreviousPage}
              disabled={!canPrevious}
              role="tab"
              aria-label={previousAriaLabel}
            >
              {previousLabel}
            </button>
          </li>
          {this._pageList()}
          <li key="nextPage">
            <button
              className={this._classNames.previousNextPage}
              onClick={this.handleNextPage}
              disabled={!canNext}
              role="tab"
              aria-label={nextAriaLabel}
            >
              {nextLabel}
            </button>
          </li>
        </ul>
      </FocusZone>
    );
  }

  private handleFirstPage = () => {
    this.handleSelectedPage(0);
  };

  private handleLastPage = () => {
    this.handleSelectedPage(this.props.pageCount - 1);
  };

  private onComboBoxChanged = (option: IComboBoxOption, index: number, value: string) => {
    console.log('_onChanged() is called: option = ' + JSON.stringify(option) + ' index = ' + index + ' value = ' + value);
    if (option !== undefined) {
      this.handleSelectedPage(index);
    }
  };

  private handleSelectedPage = (selected: number) => {
    const { selectedPageIndex, onPageChange } = this.props;
    if (selected === selectedPageIndex) {
      return; // same page, no action
    }
    if (onPageChange) {
      onPageChange(selected);
    }
  };

  private handlePreviousPage = () => {
    this.handleSelectedPage(this.props.selectedPageIndex! - 1);
  };

  private handleNextPage = () => {
    this.handleSelectedPage(this.props.selectedPageIndex! + 1);
  };

  private _pageElement(index: number): JSX.Element {
    const { pageAriaLabel, selectedPageIndex } = this.props;
    return (
      <PageNumber
        key={index + 1}
        page={index + 1}
        pageAriaLabel={pageAriaLabel}
        selected={index === selectedPageIndex}
        applyPage={this.handleSelectedPage}
        className={this._classNames.pageNumber}
      />
    );
  }

  private _pageList(): JSX.Element[] {
    const { marginPages, omittedPagesAriaLabel, omissionLabel, pageCount, pageRange, selectedPageIndex } = this.props;
    const pageList = [];
    if (pageCount <= pageRange!) {
      for (let index = 0; index < pageCount; index++) {
        pageList.push(this._pageElement(index));
      }
    } else {
      const leftHalfCount = pageRange! / 2;
      const rightHalfCount = pageRange! - leftHalfCount;

      let leftSide = leftHalfCount;
      let rightSide = rightHalfCount;

      if (selectedPageIndex! > pageCount - 1 - leftHalfCount) {
        rightSide = pageCount - 1 - selectedPageIndex!;
        leftSide = pageRange! - rightSide;
      } else if (selectedPageIndex! < leftHalfCount) {
        leftSide = selectedPageIndex!;
        rightSide = pageRange! - leftSide;
      }

      let previousIndexIsOmitted = false;
      for (let index = 0; index < pageCount; index++) {
        const page = index + 1;
        if (
          page <= marginPages! ||
          page > pageCount - marginPages! ||
          (index >= selectedPageIndex! - leftSide && index <= selectedPageIndex! + rightSide)
        ) {
          pageList.push(this._pageElement(index));
          previousIndexIsOmitted = false;
          continue;
        }

        if (previousIndexIsOmitted === false) {
          const listKey = 'ellipsis' + index.toString();
          pageList.push(
            <li key={listKey} className={this._classNames.omission} aria-label={omittedPagesAriaLabel}>
              {omissionLabel}
            </li>
          );
          previousIndexIsOmitted = true;
        }
      }
    }

    return pageList;
  }
}
