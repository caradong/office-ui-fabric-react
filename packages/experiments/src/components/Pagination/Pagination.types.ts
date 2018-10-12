import { IStyle, ITheme } from '../../Styling';
import { IStyleFunctionOrObject, IRefObject } from '../../Utilities';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export interface IPagination {}

export interface IPaginationProps {
  /**
   * The total number of pages.
   */
  pageCount: number;

  firstPageIconProps?: IIconProps;
  lastPageIconProps?: IIconProps;
  previousPageIconProps?: IIconProps;
  nextPageIconProps?: IIconProps;

  itemsPerPage?: number;
  totalItemCount?: number;

  /**
   * Selected page index
   * @default 0
   */
  selectedPageIndex?: number;

  /**
   * aria label for the next page button
   */
  nextAriaLabel?: string;

  /**
   * aria label for the previous page button
   */
  previousAriaLabel?: string;
  firstPageAriaLabel?: string;
  lastPageAriaLabel?: string;

  /**
   * aria label for the omitted pages
   */
  omittedPagesAriaLabel?: string;

  /**
   * aria label for the page buttons
   */
  pageAriaLabel?: string;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IPaginationStyleProps, IPaginationStyles>;

  /**
   * Optional callback to access the IPagination interface. Use this instead of ref for accessing
   * the public methods and properties of the component.
   */
  componentRef?: IRefObject<IPagination>;

  /**
   * Theme provided by High-Order Component.
   */
  theme?: ITheme;

  withComboBox?: boolean;

  numberOfPageButton?: number;

  /**
   * The call back function to load another page in the table. This needs to be defined in the parent component.
   */
  onPageChange?: (index: number) => void;
}

export interface IPaginationStyleProps {
  theme: ITheme;
}

export interface IPaginationStyles {
  /**
   * Style for the root element state.
   */
  root: IStyle;
  comboBox: IStyle;
  pageNumber: IStyle;
  previousNextPage: IStyle;
  previousNextPageDisabled: IStyle;
  visibleItemLabel: IStyle;
}
