import {HEIGHT, WIDTH} from  './config';
import {STATE_SHIP} from  './common';
import {flatten} from './common';

/**
 * Random placing ships.
 * @param squares
 * @param ships
 * @returns {*}
 */
export default function placeShips(squares, ships) {
    let biggestShip = 0;

    for (let key in ships) {
        if (ships[key] > 0 && biggestShip < key) {
            biggestShip = +key;
        }
    }

    if (biggestShip === 0) {
        return squares;
    }

    let positions = possiblePositions(squares, biggestShip);
    if (positions.length === 0) {
        return false;
    }

    positions.sort(function(a, b){return 0.5 - Math.random()});
    let ships_copy = Object.assign({}, ships);
    ships_copy[biggestShip]--;
    for (let position of positions) {
        placeShip(squares, biggestShip, position.row, position.column, position.verticalDirection);

        let placed = placeShips(squares, ships_copy);

        if (placed) {
            return squares;
        }

        dropShip(squares, biggestShip, position.row, position.column, position.verticalDirection);
    }

    return false;
}

/**
 * Find possible positions of the ship size.
 *
 * @param squares
 * @param shipSize
 * @returns {Array}
 */
function possiblePositions(squares, shipSize) {
    let result = [];

    for (let row = 0; row < HEIGHT; row++) {
        for (let column = 0; column < WIDTH; column++) {
            [true, false].map(function(verticalDirection) {
                if (placeShip(squares, shipSize, row, column, verticalDirection)) {
                    result.push({
                        row: row,
                        column: column,
                        verticalDirection: verticalDirection
                    });
                    dropShip(squares, shipSize, row, column, verticalDirection);
                }
                return true;
            });
        }
    }

    return result;
}

/**
 * Place ship on position.
 *
 * @param squares
 * @param shipSize
 * @param row
 * @param column
 * @param verticalDirection
 * @returns {boolean}
 */
function placeShip(squares, shipSize, row, column, verticalDirection) {
    if (verticalDirection) {
        if (row + shipSize > HEIGHT) {
            return false;
        }

        if (
            row > 0
            && (
                (squares[flatten(row - 1, column)] & STATE_SHIP)
                || (column > 0 && (squares[flatten(row - 1, column - 1)] & STATE_SHIP))
                || (column < WIDTH - 1 && (squares[flatten(row - 1, column + 1)] & STATE_SHIP))
            )
        ) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            if (
                (squares[flatten(row + i, column)] & STATE_SHIP)
                || (column > 0 && (squares[flatten(row + i, column - 1)] & STATE_SHIP))
                || (column < WIDTH - 1 && (squares[flatten(row + i, column + 1)] & STATE_SHIP))
            ) {
                return false;
            }
        }

        if (
            row + shipSize < HEIGHT
            && (
            squares[flatten(row + shipSize, column)] & STATE_SHIP
            || (column > 0 && squares[flatten(row + shipSize, column - 1)] & STATE_SHIP)
            || (column < WIDTH - 1 && squares[flatten(row + shipSize, + column + 1)] & STATE_SHIP) )
        ) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            squares[flatten(row + i, + column)] = STATE_SHIP;
        }
    } else {
        if (column + shipSize > WIDTH) {
            return false;
        }

        if (
            column > 0
            && (
                squares[flatten(row, column - 1)] & STATE_SHIP
                || (row > 0 && squares[flatten(row - 1, column - 1)] & STATE_SHIP)
                || (row < HEIGHT - 1 && squares[flatten(row + 1, column - 1)] & STATE_SHIP)
            )
        ) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            if (squares[flatten(row, column + i)] & STATE_SHIP
                || (row > 0 && squares[flatten(row - 1, column + i)] & STATE_SHIP)
                || (row < HEIGHT - 1 && squares[flatten(row + 1, column + i)] & STATE_SHIP)
            ) {
                return false;
            }
        }
        if (column + shipSize < WIDTH
            && (
                (squares[flatten(row, column + shipSize)] & STATE_SHIP)
                || (row > 0 && (squares[flatten(row - 1, column + shipSize)] & STATE_SHIP))
                || (row < HEIGHT - 1 && (squares[flatten(row + 1, column + shipSize)] & STATE_SHIP))
            )
        ) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            squares[flatten(row, column + i)] = STATE_SHIP;
        }
    }

    return true;
}

/**
 * Drop ship from position.
 *
 * @param squares
 * @param shipSize
 * @param row
 * @param column
 * @param verticalDirection
 * @returns {boolean}
 */
function dropShip(squares, shipSize, row, column, verticalDirection) {
    if (verticalDirection) {
        if (row + shipSize > HEIGHT) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            squares[flatten(row + i, column)] = 0;
        }
    } else {
        if (column + shipSize > WIDTH) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            squares[flatten(row, column + i)] = 0;
        }
    }

    return true;
}

