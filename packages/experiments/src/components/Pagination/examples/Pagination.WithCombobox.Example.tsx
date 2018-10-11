import * as React from 'react';
import { Pagination } from '@uifabric/experiments/lib/Pagination';

export interface IPaginationBasicExampleState {
  selectedPageIndex: number;
}
export class PaginationWithComboboxExample extends React.Component<{}, IPaginationBasicExampleState> {
  constructor(props: {}) {
    super(props);

    this.state = { selectedPageIndex: 0 };
  }

  public render(): JSX.Element {
    return (
      <Pagination
        selectedPageIndex={this.state.selectedPageIndex}
        pageCount={28}
        previousLabel={'<'}
        nextLabel={'>'}
        onPageChange={this.onPageChange}
        withComboBox={true}
      />
    );
  }

  private onPageChange = (index: number): void => {
    this.setState({
      selectedPageIndex: index
    });
  };
}
