import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    if (props.winner && props.value === props.winner)
        return (
            <button className="square winner"
                onClick={props.onClick}>
                {props.value}
            </button>
        );

    return (
        <button className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );

}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} winner={this.props.winner} />);
    }

    render() {
        ;
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null), col: null, row: null }],
            xIsNext: true,
            stepNumber: 0,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        let col;
        let row;
        if (i < 3)
            row = 1;
        else if (i < 6)
            row = 2;
        else
            row = 3;
        if (i === 0 || i === 3 || i === 6)
            col = 1;
        else if (i === 1 || i === 4 || i === 7)
            col = 2;
        else
            col = 3;

        this.setState({
            history: history.concat([{ squares: squares, col: col, row: row }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ' col: ' + step.col + ' row: ' + step.row : 'Go to game start';
            if (step === current)
                return (
                    <li className='current_item' key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                    </li>
                );

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        const Findstatus = () => {
            let status;
            if (winner) {
                status = 'Winner: ' + winner + ', Congratulations!!!';
                return (
                    <p className='game-end'>{status}</p>
                );
            }
            else if (current.squares.every((i) => i !== null)) {
                status = 'Tie!!!'
                return (
                    <p className='game-end'>{status}</p>
                );
            }
            else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
                return (
                    <p>{status}</p>
                );
            }
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares}
                        onClick={(i) => this.handleClick(i)} winner={winner} />
                </div>
                <div className="game-info">
                    <div><Findstatus /></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return squares[a];
        }
    }
    return null;
}
