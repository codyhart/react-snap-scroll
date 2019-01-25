import React, { Component } from 'react';
import ReactSnapScroll from 'react-snap-scroll';
import './App.css';

const children = [
    <div className="page red" key="red">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
    <div className="page orange" key="orange">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
    <div className="page yellow" key="yellow">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
    <div className="page green" key="green">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
    <div className="page blue" key="blue">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
    <div className="page purple" key="purple">
        <h2><span>Snap</span><span>Scroll</span></h2>
    </div>,
];

class App extends Component {

    state = {
        transition: 'move-top-bottom',
        index: 0,
    }

    transitionChanged = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    indexChanged = index => {
        this.setState({ index });
    }

    render() {

        const { transition, index } = this.state;

        return (
            <div className="App">
                <ReactSnapScroll
                    transition={ transition }
                    indexChanged={ this.indexChanged }
                >
                    { children.map(child => child) }
                </ReactSnapScroll>
                <div className="controls">
                    <form>
                        <h3>Transition</h3>
                        <select onChange={ this.transitionChanged } name="transition">
                            <option value="move-top-bottom">Move To Top / From Bottom</option>
                            <option value="move-top-bottom-stagger">Move To Top Stagger / From Bottom</option>
                            <option value="scale-down-top-bottom">Scale Down / From Bottom</option>
                            <option value="scale-down-up">Scale Down / Scale Up</option>
                            <option value="fold-top-bottom">Fold Top / From Bottom</option>
                            <option value="cube-top-bottom">Cube Top / From Bottom</option>
                        </select>
                    </form>
                </div>
                <div className="pagination">
                    { index + 1 } / { children.length }
                </div>
            </div>
        );

    }

}

export default App;
