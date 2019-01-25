# ReactSnapScroll
##### Introduction:
___
A React.js Component for "snap" scrolling between elements.

##### Install:
___
```sh
npm install react-snap-scroll --save
// Or
yarn add react-snap-scroll
```

##### Usage:
___
```javascript
import ReactSnapScroll from 'react-snap-scroll';

const App = () => (
    <ReactSnapScroll transition="move-top-bottom">
        <div />
        <div />
        <div />
    </ReactSnapScroll>
);
```

##### Example Usage:
___
The examples folder contains an example use with create-react-app.
```sh
cd examples
yarn
yarn start
```

##### Props:
___
Property | Type | Default | Description
--- | --- | --- | ---
`children` | node, arrayOf(node) | isRequired | The elements to snap between.
`start` | number | 0 | The starting index of the Snapper.
`indexChanged` | func | f => f | Callback function when the Snapper changes indexes.
`transition` | string | "move-top-bottom" | The transition to apply on index changed.
`orientation` | string | "vertical" | The orientation of a scroll/swipe necessary to trigger an index change.
`customTransition` | string | null | A custom classname to use for the CSSTransition instead of one of the default animations.
`customDuration` | object | { enter: 1000, exit: 1000 } | The timeout duration applied to the CSSTransition to manipulate the classes applied to the transitioning elements.

##### Built-in Transitions
___
* "move-top-bottom"
* "move-top-bottom-stagger"
* "scale-down-top-bottom"
* "scale-down-up"
* "fold-top-bottom"
* "cube-top-bottom"

These transitions come from [here](https://tympanus.net/Development/PageTransitions/).

##### Additional Information:
___
If you're using the `customTransition` prop it is assumed you know your way around `react-transition-group` and its Component `CSSTransition`. The string defined in the `customTransition` prop will be suffixed with 'forward' and 'reverse' in order to create separate transitions in either direction.

Ex:
`customTransition="my-transition"`

Classnames applied to the element that is appearing:
* `.my-transition-forward-enter`
* `.my-transition-forward-enter-active`
* `.my-transition-forward-enter-done`
* `.my-transition-reverse-enter`
* `.my-transition-reverse-enter-active`
* `.my-transition-reverse-enter-done`

Classnames applied to the element that is leaving:
* `.my-transition-forward-exit`
* `.my-transition-forward-exit-active`
* `.my-transition-forward-exit-done`
* `.my-transition-reverse-exit`
* `.my-transition-reverse-exit-active`
* `.my-transition-reverse-exit-done`

The `enter` and `exit` properties of the `customDuration` object will be applied to the `timeout` prop in `CSSTransition`. These values should match up with the animation duration + delay for the respective animation.
