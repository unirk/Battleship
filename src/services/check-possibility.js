import {HEIGHT, WIDTH, SHIPS_SIZE_COUNT} from  './config';
import {STATE_SHIP} from './common';
import {flatten} from './common';

/**
 * Check possibility of the given position.
 *
 * @param squares
 * @returns {number}
 */
export default function checkPositionPossibility(squares) {
    var sizes = JSON.parse(JSON.stringify(SHIPS_SIZE_COUNT));

    for (let row = 0; row < HEIGHT; row++) {
        for (let column = 0; column < WIDTH; column++) {
            if (squares[flatten(row, column)] & STATE_SHIP) {
                if ((column > 0 && (squares[flatten(row, column - 1)] & STATE_SHIP))
                    || (row > 0 && (squares[flatten(row - 1, column)] & STATE_SHIP))
                ) {
                    // Not start of the ship (already checked)
                    continue;
                }

                let shipLen = checkShip(squares, row, column);

                if (shipLen === -1) {
                    return -1;
                }

                if (sizes[shipLen]) {
                    sizes[shipLen]--;

                    if (sizes[shipLen] < 0) {
                        return -1;
                    }
                } else {
                    return -1;
                }
            }
        }
    }

    for (let key in sizes) {
        if (sizes[key] > 0) {
            return 0;
        }
    }

    return 1;
}

/**
 * Try to check correctness of the ship by given position.
 *
 * @param squares
 * @param row
 * @param column
 * @returns {number} Ship length or -1 if ship is impossible
 */
function checkShip(squares, row, column) {
    if (! checkDiagonals(squares, row, column)) {
        return -1;
    }

    if (row + 1 < HEIGHT && (squares[flatten(row + 1, column)] & STATE_SHIP)) {
        // Vertical direction
        let len = 1;

        while (row + len < HEIGHT && (squares[flatten(row + len, column)] & STATE_SHIP)) {
            if (! checkDiagonals(squares, row + len, column)) {
                return -1;
            }

            if (column > 0 && (squares[flatten(row + len, column - 1)] & STATE_SHIP)) {
                return -1; // Check right
            }

            if (column + 1 < WIDTH && (squares[flatten(row + len, column + 1)] & STATE_SHIP)) {
                return -1; // Check left
            }

            len++;
        }

        return len;
    } else if (column + 1 < WIDTH && (squares[flatten(row, column + 1)] & STATE_SHIP)) {
        // Horizontal direction
        let len = 1;

        while (column + len < WIDTH && (squares[flatten(row, column + len)] & STATE_SHIP)) {
            if (! checkDiagonals(squares, row, column + len)) {
                return -1;
            }

            if (row > 0 && (squares[flatten(row - 1, column + len)] & STATE_SHIP)) {
                return -1; // Check top
            }

            if (row + 1 < HEIGHT && (squares[flatten(row + 1, column + len)] & STATE_SHIP)) {
                return -1; // Check bottom
            }

            len++;
        }

        return len;
    } else {
        return 1;
    }
}

/**
 * Check diagonals emptiness by given cell.
 * @param squares
 * @param row
 * @param column
 * @returns {boolean}
 */
function checkDiagonals(squares, row, column) {
    if (row > 0) {
        if (column > 0 && (squares[flatten(row - 1, column - 1)] & STATE_SHIP)) {
            return false;
        }

        if (column + 1 < WIDTH && (squares[flatten(row - 1, column + 1)] & STATE_SHIP)) {
            return false;
        }
    }

    if (row + 1 < HEIGHT) {
        if (column > 0 && (squares[flatten(row + 1, column - 1)] & STATE_SHIP)) {
            return false;
        }

        if (column + 1 < WIDTH && (squares[flatten(row + 1, column + 1)] & STATE_SHIP)) {
            return false;
        }
    }

    return true;
}