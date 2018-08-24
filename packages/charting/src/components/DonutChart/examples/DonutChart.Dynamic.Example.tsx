import * as React from 'react';
import { DonutChart, IDonutChartProps } from '@uifabric/charting/lib/DonutChart';
import { DefaultPalette } from 'office-ui-fabric-react/lib/Styling';
import { IDataPoint } from '@uifabric/charting/lib/types/IDataPoint';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export interface IExampleState {
  dynamicData: IDataPoint[];
  colors: string[];
}

export class DonutChartDynamicExample extends React.Component<IDonutChartProps, IExampleState> {
  private _colors = [
    [
      DefaultPalette.blueLight,
      DefaultPalette.blue,
      DefaultPalette.tealLight,
      DefaultPalette.teal,
      DefaultPalette.greenLight
    ],
    [DefaultPalette.purpleLight, DefaultPalette.purple, DefaultPalette.magentaLight, DefaultPalette.magenta],
    [DefaultPalette.yellowLight, DefaultPalette.yellow, DefaultPalette.orangeLighter, DefaultPalette.orangeLight],
    [DefaultPalette.neutralTertiary, DefaultPalette.neutralSecondary, DefaultPalette.neutralPrimary]
  ];

  constructor(props: IDonutChartProps) {
    super(props);
    this.state = {
      dynamicData: [{ x: 'A', y: 25 }, { x: 'B', y: 10 }, { x: 'C', y: 60 }, { x: 'D', y: 5 }],
      colors: [
        DefaultPalette.blueLight,
        DefaultPalette.purpleLight,
        DefaultPalette.yellowLight,
        DefaultPalette.neutralSecondary
      ]
    };

    this._changeData = this._changeData.bind(this);
    this._changeColors = this._changeColors.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div>
        <DonutChart data={this.state.dynamicData} colors={this.state.colors} />
        <DefaultButton text="Change data" onClick={this._changeData} />
        <DefaultButton text="Change colors" onClick={this._changeColors} />
      </div>
    );
  }

  private _changeData(): void {
    const a = this._randomY(40);
    const b = this._randomY(100 - a - 20);
    const c = this._randomY(100 - a - b - 10);
    const d = 100 - a - b - c;

    this.setState({
      dynamicData: [{ x: 'A', y: a }, { x: 'B', y: b }, { x: 'C', y: c }, { x: 'D', y: d }]
    });
  }

  private _changeColors(): void {
    this.setState({
      colors: [this._randomColor(0), this._randomColor(1), this._randomColor(2), this._randomColor(3)]
    });
  }

  private _randomY(max: number): number {
    return Math.floor(Math.random() * max + 5);
  }

  private _randomColor(index: number): string {
    return this._colors[index][Math.floor(Math.random() * this._colors[index].length)];
  }
}
