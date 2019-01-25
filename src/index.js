import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './index.scss';

const DIRECTION = {
    FORWARD: 'forward',
    REVERSE: 'reverse',
};

const SETTINGS = {
    WHEEL_THRESHOLD: 40, // The higher the number, the more aggressive a scroll required to trigger an index change.
    SWIPE_THRESHOLD: 10, // The higher the number, the more aggressive a swipe required to trigger an index change.,
};

const TRANSITIONS = [
    'move-top-bottom',
    'move-top-bottom-stagger',
    'scale-down-top-bottom',
    'scale-down-up',
    'fold-top-bottom',
    'cube-top-bottom',
];

const TRANSITION_SETTINGS = {
    'move-top-bottom':         { DURATION: { ENTER: 1000, EXIT: 1000 }},
    'move-top-bottom-stagger': { DURATION: { ENTER: 750,  EXIT: 1000 }},
    'scale-down-top-bottom':   { DURATION: { ENTER: 1000, EXIT: 1000 }},
    'scale-down-up':           { DURATION: { ENTER: 1000, EXIT: 500  }},
    'fold-top-bottom':         { DURATION: { ENTER: 1000, EXIT: 1000 }},
    'cube-top-bottom':         { DURATION: { ENTER: 1000, EXIT: 1000 }},
};

const Wrapper = ({ children }) => (
    <div className="Wrapper">
        <div className="inner">
            { children }
        </div>
    </div>
);

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

class ReactSnapScroll extends React.Component {

    static get propTypes() {
        return {
            children: PropTypes.oneOfType([
                PropTypes.node,
                PropTypes.arrayOf(PropTypes.node),
            ]).isRequired,
            start: PropTypes.number,
            indexChanged: PropTypes.func,
            transition: PropTypes.oneOf(TRANSITIONS),
            orientation: PropTypes.oneOf(['vertical', 'horizontal']),
            customTransition: PropTypes.string,
            customDuration: PropTypes.object,
        }
    }

    static get defaultProps() {
        return {
            start: 0,
            indexChanged: f => f,
            transition: TRANSITIONS[0],
            orientation: 'vertical',
            customTransition: null,
            customDuration: { enter: 1000, exit: 1000 },
        }
    }

    // Returns 0 if the start prop is undefined or out of bounds.
    getStartIndex() {
        const { start, children } = this.props;
        return !children.length ? 0 : (start >= 0 && start < children.length) ? Math.floor(start) : 0;
    }

    state = {
        index: this.getStartIndex(),
        direction: DIRECTION.FORWARD,
    }

    constructor(props) {

        super(props);

        this.xDown = null;
        this.yDown = null;
        this.locked = false;

    }

    componentDidMount() {

        this.$node.addEventListener('wheel', this.mouseScrollHandler, false);
        this.$node.addEventListener('touchstart', this.touchStartHandler, false);
        this.$node.addEventListener('touchmove', this.touchMoveHandler, false);

        // Fire initial indexChanged();
        this.props.indexChanged(this.state.index);

    }

    componentWillUnmount() {
        this.$node.removeEventListener('wheel', this.mouseScrollHandler, false);
        this.$node.removeEventListener('touchstart', this.touchStartHandler, false);
        this.$node.removeEventListener('touchmove', this.touchMoveHandler, false);
    }

    mouseScrollHandler = e => {

        // Don't trigger another index change if we're still animating.
        if (this.locked) return;

        this.lock();
        e.preventDefault();

        if (this.props.children.length) {

            const isVertical = (this.props.orientation === 'vertical');
            const delta = isVertical ? e.deltaY : e.deltaX;

            switch (true) {
                case (delta > SETTINGS.WHEEL_THRESHOLD):
                    this.next();
                    break;
                case (delta < -SETTINGS.WHEEL_THRESHOLD):
                    this.prev();
                    break;
                default:
                    this.unlock(0);
            }

        } else {
            this.unlock(0);
        }

    }

    touchStartHandler = e => {
        this.xDown = e.touches[0].clientX;
        this.yDown = e.touches[0].clientY;
    }

    touchMoveHandler = e => {

        // Don't trigger another index change if we're still animating.
        if (this.locked) return;

        this.lock();
        e.preventDefault();

        if (!this.xDown || !this.yDown) {
            this.unlock(0);
            return;
        }

        let xUp = e.touches[0].clientX;
        let yUp = e.touches[0].clientY;

        let xDiff = (this.xDown - xUp);
        let yDiff = (this.yDown - yUp);

        const isVertical = (this.props.orientation === 'vertical');

        switch (true) {
            case ((isVertical ? yDiff : xDiff) > SETTINGS.SWIPE_THRESHOLD):
                this.next();
                break;
            case ((isVertical ? yDiff : xDiff) < -SETTINGS.SWIPE_THRESHOLD):
                this.prev();
                break;
            default:
                this.unlock(0);
                break;
        }

        this.xDown = null;
        this.yDown = null;

    }

    next = () => {

        const index = Math.min(this.state.index + 1, this.props.children.length - 1);

        this.setState({
            index,
            direction: DIRECTION.FORWARD,
        }, () => {
            this.unlock();
            this.props.indexChanged(index);
        });

    }

    prev = () => {

        const index = Math.max(0, this.state.index - 1);

        this.setState({
            index,
            direction: DIRECTION.REVERSE,
        }, () => {
            this.unlock();
            this.props.indexChanged(index);
        });

    }

    getUnlockDelay = () => {

        const { customTransition, customDuration } = this.props;

        return customTransition ?
        Math.max(customDuration.enter, customDuration.exit) :
        Math.max(TRANSITION_SETTINGS[this.props.transition].DURATION.ENTER, TRANSITION_SETTINGS[this.props.transition].DURATION.EXIT);

    }

    lock = () => {
        this.locked = true;
    }

    unlock = (delay = this.getUnlockDelay()) => {
        setTimeout(() => this.locked = false, delay);
    }

    renderPages() {

        const { children, transition, customTransition, customDuration } = this.props;
        const { index, direction } = this.state;

        const isArray = Array.isArray(children);
        const timeout = customTransition ?
        customDuration :
        { enter: TRANSITION_SETTINGS[transition].DURATION.ENTER, exit: TRANSITION_SETTINGS[transition].DURATION.EXIT };

        return isArray ?
        children.map((child, key) => {
            return (
                <CSSTransition
                    key={ key }
                    in={ key === index }
                    timeout={ timeout }
                    classNames={ `${ customTransition ? customTransition : transition }-${ direction }` }
                    mountOnEnter
                    unmountOnExit
                >
                    <Wrapper>{ child }</Wrapper>
                </CSSTransition>
            );
        }) : <Wrapper>{ children }</Wrapper>;

    }

    render() {
        return (
            <div className="ReactSnapScroll" ref={ el => this.$node = el }>
                { this.renderPages() }
            </div>
        );
    }

}

export default ReactSnapScroll;
