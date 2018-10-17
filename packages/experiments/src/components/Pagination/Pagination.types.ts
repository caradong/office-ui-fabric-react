import { IStyle, ITheme } from '../../Styling';
import { IStyleFunctionOrObject, IRefObject } from '../../Utilities';
import { IIconProps } from 'office-ui-fabric-react/lib/Icon';

export interface IPagination {}

export interface IPaginationProps {
  /**
   * The total number of pages.
   */
  pageCount: number;

  itemsPerPage?: number;
  totalItemCount?: number;

  /**
   * Selected page index
   * @default 0
   */
  selectedPageIndex?: number;

  /**
   * Icon prop for the first page button
   */
  firstPageIconProps?: IIconProps;

  /**
   * Icon prop for the previous page button
   */
  previousPageIconProps?: IIconProps;

  /**
   * Icon prop for the next page button
   */
  nextPageIconProps?: IIconProps;

  /**
   * Icon prop for the last page button
   */
  lastPageIconProps?: IIconProps;

  /**
   * aria label for the first page button
   */
  firstPageAriaLabel?: string;

  /**
   * aria label for the previous page button
   */
  previousPageAriaLabel?: string;

  /**
   * aria label for the next page button
   */
  nextPageAriaLabel?: string;

  /**
   * aria label for the last page button
   */
  lastPageAriaLabel?: string;

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

  /**
   * Use the combo box or not
   */
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
