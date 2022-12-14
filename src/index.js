import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


function Square(props) {
    return (
        <button className="square" id = {props.id} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
        <Square 
            id = {i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
        );
    }

    render() {
        
        return (

            // For loops that create the board square 3x3
            
            [0,1,2].map((row) => {
                return (
                    <div className="board-row">
                        {[0,1,2].map((col) => {
                            return this.renderSquare(row * 3 + col);
                        })}
                    </div>
                );
            })
        );
    }
}


class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            // -1 is before game starts
            indexHistory: [-1],
            isDescending: true,
        };

        this.toggleOrder = this.toggleOrder.bind(this);

    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const indexHistory = this.state.indexHistory.slice(0, this.state.stepNumber + 1);

        if (calculateWinner(squares) || squares[i]) {
            return;
        } else {
            for (let i = 0; i < 9; i++) {
                document.getElementById(i).style.backgroundColor = "white";
            }
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            indexHistory: indexHistory.concat(i),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // Button function that toggle ascending/descending order
    toggleOrder() {
        this.setState({
            isDescending: !this.state.isDescending,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            const coord = (move % 2) === 0 ?
            "O," + calculateCoordinates(this.state.indexHistory[move]) :
            "X," + calculateCoordinates(this.state.indexHistory[move])
            const desc = move ?
                'Go to move #' + move + " (" + coord + ")":
                'Go to game start';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );

        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner[0];
            // Highlight winning squares
            for (let i = 0; i < 3; i++) {
                document.getElementById(winner[1][i]).style.backgroundColor = "yellow";
            }
        } else if (this.state.stepNumber === 9) {
            status = "It's a draw!";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <button onClick={this.toggleOrder}>Toggle Order</button>
            <ul>{this.state.isDescending ? moves : moves.reverse()}</ul>
            </div>
        </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            console.log(i);
            return [squares[a], lines[i]];
        }
    }
    return null;
}

// Function that returns an array
// of the coordinates of the square
// that was clicked
function calculateCoordinates(index) {
    // col, row
    const coordinates = [
        [0,0],[1,0],[2,0],
        [0,1],[1,1],[2,1],
        [0,2],[1,2],[2,2]
    ];

    return coordinates[index];

}
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
