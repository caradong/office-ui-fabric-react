import * as React from 'react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { BaseComponent, classNamesFunction } from '../../Utilities';
import { PageNumber } from './PageNumber';
import { IPaginationProps, IPaginationStyleProps, IPaginationStyles } from './Pagination.types';
// import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { ComboBox, IComboBoxOption } from 'office-ui-fabric-react/lib/ComboBox';

const getClassNames = classNamesFunction<IPaginationStyleProps, IPaginationStyles>();

export class PaginationBase extends BaseComponent<IPaginationProps, {}> {
  public static defaultProps: Partial<IPaginationProps> = {
    selectedPageIndex: 0,
    withComboBox: false,
    numberOfPageButton: 5,
    previousPageIconProps: { iconName: 'CaretSolidLeft' },
    nextPageIconProps: { iconName: 'CaretSolidRight' },
    firstPageIconProps: { iconName: 'Previous' },
    lastPageIconProps: { iconName: 'Next' }
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
    const { pageCount, selectedPageIndex, withComboBox, styles, theme, itemsPerPage, totalItemCount } = this.props;

    this._classNames = getClassNames(styles!, {
      theme: theme!
    });

    const canPrevious = selectedPageIndex! > 0;
    const canNext = selectedPageIndex! + 1 < pageCount;
    const canFirst = selectedPageIndex !== 0;
    const canLast = selectedPageIndex !== pageCount - 1;

    if (withComboBox) {
      return (
        <div>
          <IconButton
            iconProps={{ iconName: 'DoubleChevronLeft' }}
            onClick={this.handleFirstPage}
            disabled={!canFirst}
            aria-label="First page"
          />
          <IconButton
            iconProps={{ iconName: 'ChevronLeft' }}
            onClick={this.handlePreviousPage}
            disabled={!canPrevious}
            aria-label="Previous page"
          />
          <ComboBox
            ariaLabel={`${pageCount} pages available`}
            selectedKey={`${selectedPageIndex}`}
            options={this.scaleOptions}
            onChanged={this.onComboBoxChanged}
            styles={{
              container: this._classNames.comboBox
            }}
          />
          <span>{` of ${pageCount}`}</span>
          <IconButton iconProps={{ iconName: 'ChevronRight' }} onClick={this.handleNextPage} disabled={!canNext} aria-label="Next page" />
          <IconButton
            iconProps={{ iconName: 'DoubleChevronRight' }}
            onClick={this.handleLastPage}
            disabled={!canLast}
            aria-label="Last page"
          />
        </div>
      );
    }

    // FocusZone handles A11Y requirement such as:
    // Dynamically set tabindex (0 or -1) to the correct item
    // Refocus to the active item when component re-renders
    // Handles all key strokes, e.g., left/right, space, enter
    let visibleItemLabel;
    if (itemsPerPage && totalItemCount) {
      const leftItemIndex = selectedPageIndex! * itemsPerPage + 1;
      const rightItemsIndex = Math.min((selectedPageIndex! + 1) * itemsPerPage, totalItemCount);
      visibleItemLabel = `${leftItemIndex} -  ${rightItemsIndex} of ${totalItemCount}`;
    }
    return (
      <div className={this._classNames.root}>
        <div>
          <IconButton
            iconProps={this.props.firstPageIconProps}
            onClick={this.handleFirstPage}
            disabled={!canFirst}
            aria-label="First page"
            styles={{
              icon: this._classNames.previousNextPage,
              rootDisabled: this._classNames.previousNextPageDisabled
            }}
          />
          <IconButton
            iconProps={this.props.previousPageIconProps}
            onClick={this.handlePreviousPage}
            disabled={!canPrevious}
            aria-label="Previous page"
            styles={{
              icon: this._classNames.previousNextPage,
              rootDisabled: this._classNames.previousNextPageDisabled
            }}
          />
          {this._pageList()}
          {/* <FocusZone direction={FocusZoneDirection.horizontal}>{this._pageList()}</FocusZone> */}
          <IconButton
            iconProps={this.props.nextPageIconProps}
            onClick={this.handleNextPage}
            disabled={!canNext}
            aria-label="Next page"
            styles={{
              icon: this._classNames.previousNextPage,
              rootDisabled: this._classNames.previousNextPageDisabled
            }}
          />
          <IconButton
            iconProps={this.props.lastPageIconProps}
            onClick={this.handleLastPage}
            disabled={!canLast}
            aria-label="Last page"
            styles={{
              icon: this._classNames.previousNextPage,
              rootDisabled: this._classNames.previousNextPageDisabled
            }}
          />
        </div>
        {visibleItemLabel && (
          <div className={this._classNames.visibleItemLabel} aria-label={visibleItemLabel}>
            {visibleItemLabel}
          </div>
        )}
      </div>
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
    const { pageAriaLabel, selectedPageIndex, pageCount } = this.props;
    const ariaLabel = pageAriaLabel && `${pageAriaLabel} ${index + 1} of ${pageCount}`;

    return (
      <PageNumber
        key={index + 1}
        page={index + 1}
        ariaLabel={ariaLabel}
        selected={index === selectedPageIndex}
        applyPage={this.handleSelectedPage}
        className={this._classNames.pageNumber}
      />
    );
  }

  private _pageList(): JSX.Element[] {
    const { numberOfPageButton, pageCount, selectedPageIndex } = this.props;
    const pageList = [];
    if (pageCount <= numberOfPageButton!) {
      for (let index = 0; index < pageCount; index++) {
        pageList.push(this._pageElement(index));
      }
    } else {
      const leftHalfCount = Math.floor((numberOfPageButton! - 1) / 2);
      const rightHalfCount = numberOfPageButton! - 1 - leftHalfCount;

      let leftSide = selectedPageIndex! - leftHalfCount;
      let rightSide = selectedPageIndex! + rightHalfCount;

      if (rightSide > pageCount - 1) {
        rightSide = pageCount - 1;
        leftSide = rightSide - numberOfPageButton! + 1;
      } else if (leftSide < 0) {
        leftSide = 0;
        rightSide = numberOfPageButton! - 1;
      }

      for (let index = leftSide; index <= rightSide; index++) {
        pageList.push(this._pageElement(index));
      }
    }

    return pageList;
  }
}
