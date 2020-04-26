import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonGroup } from 'react-bootstrap';

class Cell extends React.Component {
    constructor() {
        super();
    }

    selectCell = () => {
        this.props.selectCell(this.props.row, this.props.col);
    };

    render() {
        return (
            <div
                className={this.props.cellClass}
                id={this.props.cellID}
                onClick={this.selectCell} // which selectCell method to use?
            >
            </div>
        );
    }
}

class Grid extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const width = this.props.cols * 29;
        var rowsArr = [];

        // Don't understand this part
        var cellClass = "";
        for (var i = 0; i < this.props.rows; i++) {
            for (var j = 0; j < this.props.cols; j++) {
                var cellID = i + "-" + j;
                cellClass = this.props.gridArray[i][j] ? "cell on" : "cell off";
                rowsArr.push(
                    <Cell
                        cellClass={cellClass}
                        key={cellID}
                        cellID={cellID} // cell and ID are the same?
                        row={i}
                        col={j}
                        selectCell={this.props.selectCell}
                    />
                )
            }
        }

        return (
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        )
    }
}

class ControlButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <button type="button" onClick={this.props.onClick}>{this.props.text}</button>
            </div>
        );
    }
}

class Main extends React.Component {
    constructor() {
        super();

        // Could make it resize with window, but I rather do this.
        this.rows = Math.floor(window.innerHeight / 34);
        this.cols = Math.floor(window.innerWidth / 30);

        this.state = {
            speed: 100,
            rows: this.rows,
            cols: this.cols,
            curGeneration: 0,
            gridArray: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        };

        // this.selectCell = this.selectCell.bind(this); // Instead of binding I could make selectCell an arrow function
    }

    selectCell = (row, col) => {
        let gridArrayCopy = this.state.gridArray.map(array => array.slice());
        gridArrayCopy[row][col] = !gridArrayCopy[row][col];
        this.setState({
            gridArray: gridArrayCopy
        });
    };

    randomSeed = () => {
        // Clear before applying random seed
        var gridArrayCopy = Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false));
        for (var i = 0; i < this.state.rows; i++) {
            for (var j = 0; j < this.state.cols; j++) {
                if (Math.random() > 0.7) {
                    gridArrayCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridArray: gridArrayCopy
        });
    };

    runInterval = () => {
        var g0 = this.state.gridArray;
        var g1 = this.state.gridArray.map(array => array.slice());

        for (var i = 0; i < this.state.rows; i++) {
            for (var j = 0; j < this.state.cols; j++) {

                var neighbourCount = 0;

                if (i > 0 && j > 0) if (g0[i - 1][j - 1]) {
                    neighbourCount++;
                }
                if (j > 0) if (g0[i][j - 1]) {
                    neighbourCount++;
                }
                if (i < this.state.rows - 1 && j > 0) if (g0[i + 1][j - 1]) {
                    neighbourCount++;
                }

                if (i > 0) if (g0[i - 1][j]) {
                    neighbourCount++;
                }
                if (i < this.state.rows - 1) if (g0[i + 1][j]) {
                    neighbourCount++;
                }

                if (i > 0 && j < this.state.cols - 1) if (g0[i - 1][j + 1]) {
                    neighbourCount++;
                }
                if (j < this.state.cols - 1) if (g0[i][j + 1]) {
                    neighbourCount++;
                }
                if (i < this.state.rows - 1 && j < this.state.cols - 1) if (g0[i + 1][j + 1]) {
                    neighbourCount++;
                }

                if (g0[i][j] && (neighbourCount < 2 || neighbourCount > 3)) {
                    g1[i][j] = false;
                }
                if (!g0[i][j] && neighbourCount === 3) {
                    g1[i][j] = true;
                }
            }
        }

        this.setState({
            curGeneration: this.state.curGeneration + 1,
            gridArray: g1
        });
    };

    play = () => {
        clearInterval(this.intervalId);
        this.setState({
            curGeneration: 0,
        });
        this.intervalId = setInterval(this.runInterval, this.state.speed);
    };

    stop = () => {
        clearInterval(this.intervalId);
    };

    clear = () => {
        this.setState({
            gridArray: Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false))
        });
    };

    modifySpeed = (x) => {
        if (this.state.speed > x + 1) {
            this.setState({
                speed: this.state.speed + x
            });
        }
    };

    componentDidMount() { // As soon as component loads, this loads
        this.randomSeed();
    }

    render() {
        return (
            <div>
                <h1 className="center">A Game of Life</h1>
                <h2 className="center">Generation: {this.state.curGeneration}</h2>

                <div className="center">
                    <ButtonGroup>
                        <ControlButton
                            text="Play"
                            onClick={this.play}
                        />
                        <ControlButton
                            text="Stop"
                            onClick={this.stop}
                        />
                        <ControlButton
                            text="Random"
                            onClick={this.randomSeed}
                        />
                        <ControlButton
                            text="Clear"
                            onClick={this.clear}
                        />
                        <ControlButton
                            text="Faster"
                            onClick={() => this.modifySpeed(-5)}
                        />
                        <ControlButton
                            text="Slower"
                            onClick={() => this.modifySpeed(5)}
                        />
                    </ButtonGroup>
                </div>

                <Grid
                    gridArray={this.state.gridArray}
                    rows={this.state.rows}
                    cols={this.state.cols}
                    selectCell={this.selectCell}
                />
            </div>
        )
    }
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);
