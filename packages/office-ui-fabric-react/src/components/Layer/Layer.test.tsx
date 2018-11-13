import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { Layer } from './Layer';
import { LayerHost } from './LayerHost';

const ReactDOM = require('react-dom');

const testEvents: string[] = (
  'click contextmenu doubleclick drag dragend dragenter dragleave dragover dragstart drop ' +
  'mousedown mousemove mouseout mouseup keydown keypress keyup focus blur change input submit'
).split(' ');

describe('Layer', () => {
  it('renders Layer correctly', () => {
    // Mock createPortal to capture its component hierarchy in snapshot output.
    const createPortal = ReactDOM.createPortal;
    ReactDOM.createPortal = jest.fn(element => {
      return element;
    });

    const component = renderer.create(<Layer>Content</Layer>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    ReactDOM.createPortal = createPortal;
  });

  it('can render in a targeted LayerHost and pass context through', () => {
    class Child extends React.Component<{}, {}> {
      public static contextTypes = {
        foo: PropTypes.string.isRequired
      };

      public context: any;

      public render(): JSX.Element {
        return <div id="child">{this.context.foo}</div>;
      }
    }

    class Parent extends React.Component<{}, {}> {
      public static childContextTypes = {
        foo: PropTypes.string
      };

      public getChildContext() {
        return {
          foo: 'foo'
        };
      }

      public render(): JSX.Element {
        return (
          <div id="parent">
            <Layer hostId="foo">
              <Child />
            </Layer>
          </div>
        );
      }
    }

    class App extends React.Component<{}, {}> {
      public render(): JSX.Element {
        return (
          <div id="app">
            <Parent />
            <LayerHost id="foo" />
          </div>
        );
      }
    }

    const appElement = document.createElement('div');

    try {
      document.body.appendChild(appElement);
      ReactDOM.render(<App />, appElement);

      const parentElement = appElement.querySelector('#parent');

      expect(parentElement).toBeDefined();
      expect(parentElement!.ownerDocument).toBeDefined();

      const childElement = appElement.querySelector('#child') as Element;

      expect(childElement.textContent).toEqual('foo');
    } finally {
      ReactDOM.unmountComponentAtNode(appElement);
      appElement.remove();
    }
  });

  it('stops events correctly', () => {
    // Simulate does not propagate events up the hierarchy.
    // Instead, let's check for calls to stopPropagation.
    // https://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
    const targetClassName = 'ms-Layer-content';
    const expectedStopPropagationCount = testEvents.length;
    let stopPropagationCount = 0;

    const eventObject = (event: string) => {
      return {
        stopPropagation: () => {
          // Debug code for figuring out which events are firing on test failures:
          // console.log(event);
          stopPropagationCount++;
        }
      };
    };

    const wrapper = mount(<Layer />);

    const targetContent = wrapper.find(`.${targetClassName}`).at(0);

    testEvents.forEach(event => {
      targetContent.simulate(event, eventObject(event));
    });

    expect(stopPropagationCount).toEqual(expectedStopPropagationCount);

    // These events should never be stopped
    targetContent.simulate('mouseenter', eventObject('mouseenter'));
    targetContent.simulate('mouseleave', eventObject('mouseleave'));

    expect(stopPropagationCount).toEqual(expectedStopPropagationCount);
  });

  it('bubbles events correctly', () => {
    // Simulate does not propagate events up the hierarchy.
    // Instead, let's check for calls to stopPropagation.
    // https://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
    const targetClassName = 'ms-Layer-content';
    let stopPropagationCount = 0;

    const eventObject = (event: string) => {
      return {
        stopPropagation: () => {
          // Debug code for figuring out which events are firing on test failures:
          // console.log(event);
          stopPropagationCount++;
        }
      };
    };

    const wrapper = mount(<Layer eventBubblingEnabled={true} />);

    const targetContent = wrapper.find(`.${targetClassName}`).at(0);

    testEvents.forEach(event => {
      targetContent.simulate(event, eventObject(event));
    });

    expect(stopPropagationCount).toEqual(0);

    // These events should always bubble
    targetContent.simulate('mouseenter', eventObject('mouseenter'));
    targetContent.simulate('mouseleave', eventObject('mouseleave'));

    expect(stopPropagationCount).toEqual(0);
  });
});
