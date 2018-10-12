import { IPaginationStyles, IPaginationStyleProps } from './Pagination.types';
import { getGlobalClassNames, IStyle } from '../../Styling';

const GlobalClassNames = {
  root: 'ms-Pagination-container',
  pageNumber: 'ms-Pagination-pageNumber',
  omission: 'ms-Pagination-omission'
};

export function getStyles(props: IPaginationStyleProps): IPaginationStyles {
  const { theme } = props;

  const { palette } = theme;
  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  const buttonStyles: IStyle = {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent'
  };

  return {
    root: [
      classNames.root,
      {
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        selectors: {
          li: {
            display: 'inline'
          }
        }
      }
    ],
    previousNextPage: [
      {
        color: palette.themePrimary
      }
    ],
    previousNextPageDisabled: [
      {
        cursor: 'default',
        backgroundColor: 'transparent'
      }
    ],
    pageNumber: [
      classNames.pageNumber,
      buttonStyles,
      {
        verticalAlign: 'middle',
        width: '32px',
        height: '32px',
        color: palette.black,
        selectors: {
          '&:aria-selected=true': {
            color: palette.blue,
            fontWeight: 'bold'
          },
          '&[aria-selected=true]': {
            color: palette.blue,
            fontWeight: 'bold'
          }
        }
      }
    ],
    visibleItemLabel: [
      {
        color: palette.neutralSecondary
      }
    ],
    comboBox: {
      maxWidth: '70px',
      display: 'inline-block',
      verticalAlign: 'middle'
    }
  };
}
