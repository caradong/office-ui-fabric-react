import * as React from 'react';
import { Pagination } from '@uifabric/experiments/lib/Pagination';

export interface IPaginationBasicExampleState {
  selectedPageIndex: number;
}
export class PaginationCustomizationRoundExample extends React.Component<{}, IPaginationBasicExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = { selectedPageIndex: 0 };
  }

  public render(): JSX.Element {
    return (
      <Pagination
        selectedPageIndex={this.state.selectedPageIndex}
        pageCount={27}
        itemsPerPage={10}
        totalItemCount={268}
        pageAriaLabel={'page'}
        onPageChange={this.onPageChange}
        styles={{
          previousNextPage: {
            color: '#0078d4'
          },
          pageNumber: {
            fontWeight: 'bold',
            width: '32px',
            height: '32px',
            color: '#0078d4',
            textAlign: 'center',
            selectors: {
              ':hover': { textDecoration: 'underline' },
              '&:aria-selected=true': {
                backgroundColor: '#0078d4',
                fontWeight: 'bold',
                borderRadius: '16px',
                color: 'white'
              },
              '&[aria-selected=true]': {
                backgroundColor: '#0078d4',
                fontWeight: 'bold',
                borderRadius: '16px',
                color: 'white'
              }
            }
          }
        }}
      />
    );
  }

  private onPageChange = (index: number): void => {
    this.setState({
      selectedPageIndex: index
    });
  };
}
