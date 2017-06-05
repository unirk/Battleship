import React from 'react';

import {HEIGHT, WIDTH} from './../../services/config';
import {STATE_SHIP, STATE_SHIP_KILLED, STATE_SHIP_NEAR, STATE_SHOT} from  './../../services/common';

/**
 * Cell of the board.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function Square(props) {
    let className = "square";
    let html = "";

    if (props.value & STATE_SHIP_KILLED) {
        className += " red";
    } else if (props.value & STATE_SHIP_NEAR) {
        className += " gray";
    } else if ((props.value & STATE_SHIP) && (props.value & STATE_SHOT)) {
        className += " yellow";
    } else if (props.value & STATE_SHIP) {
        className += " black";
    } else if (props.value & STATE_SHOT) {
        className += " shot";
    }

    if (props.value & STATE_SHOT) {
        html = ".";
    }

    return (
        <button className={className} onClick={props.onClick}>
            {html}
        </button>
    );
}

/**
 * Board class. Contains cells.
 */
export default class Board extends React.Component {
    /**
     * Render square
     * @param i Number of square
     * @returns {XML}
     */
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={(this.props.type === 'ai' && !(this.props.squares[i] & STATE_SHOT) ? this.props.squares[i] & ~ STATE_SHIP : this.props.squares[i])}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    /**
     * Render the component.
     *
     * @returns {XML}
     */
    render() {
        var rows = [];
        let squares = [];
        for (var r = 0; r < HEIGHT; r++) {
            for (var i = r * WIDTH; i < r * WIDTH + WIDTH; i++) {
                squares.push(this.renderSquare(i));
            }
            rows.push(<div key={r} className="board-row">{squares}</div>);
            squares = [];
        }

        return <div>{rows}</div>;
    }
}