import {HEIGHT, WIDTH} from  './config';
import {STATE_SHIP, STATE_SHOT, STATE_SHIP_NEAR, STATE_SHIP_KILLED} from  './common';
import {flatten, unflatten} from './common';

/**
 * Try to find random cell to shoot.
 *
 * @param squares
 * @returns {*} Cell number or null if not found.
 */
export default function shipShootAI(squares) {
    let positions = possibleAttackPositions(squares);
    positions.sort(function(a, b){return 0.5 - Math.random()});

    if (positions.length > 0) {
        return positions[0];
    }

    return null;
}

/**
 * Find all possible attack positions.
 *
 * @param squares
 * @returns {Array}
 */
function possibleAttackPositions(squares) {
    let result = [];
    let injured = null;

    for (let i = 0; i < squares.length; i++) {
        if (!(squares[i] & STATE_SHOT) && !(squares[i] & STATE_SHIP_NEAR)) {
            result.push(i);
        }

        if ((squares[i] & STATE_SHOT) && (squares[i] & STATE_SHIP) && !(squares[i] & STATE_SHIP_KILLED)) {
            injured = unflatten(i);
            break;
        }
    }

    if (injured === null) {
        return result;
    }

    result = [];

    if ((injured.row + 1 < HEIGHT && (squares[flatten(injured.row + 1, injured.column)] & STATE_SHOT) && (squares[flatten(injured.row + 1, injured.column)] & STATE_SHIP))
        || (injured.row - 1 >= 0 && (squares[flatten(injured.row - 1, injured.column)] & STATE_SHOT) && (squares[flatten(injured.row - 1, injured.column)] & STATE_SHIP))
    ) {
        [-1, 1].map(function(offsetRow) {
            let r = injured.row + offsetRow;

            while (
                r < HEIGHT && r >= 0
                && (squares[flatten(r, injured.column)] & STATE_SHOT) && (squares[flatten(r, injured.column)] & STATE_SHIP)
                ) {
                r += offsetRow;
            }

            if (r < HEIGHT && r >= 0 && !(squares[flatten(r, injured.column)] & STATE_SHOT)) {
                result.push(flatten(r, injured.column));
            }

            return true;
        });
    } else if ( (injured.column + 1 < WIDTH && (squares[flatten(injured.row, injured.column + 1)] & STATE_SHOT) && (squares[flatten(injured.row, injured.column + 1)] & STATE_SHIP))
        || (injured.column - 1 >= 0 && (squares[flatten(injured.row, injured.column - 1)] & STATE_SHOT) && (squares[flatten(injured.row, injured.column - 1)] & STATE_SHIP))
    ) {
        [-1, 1].map(function(offsetColumn) {
            let c = injured.column + offsetColumn;

            while (
                c < WIDTH && c >= 0
                && (squares[flatten(injured.row, c)] & STATE_SHOT) && (squares[flatten(injured.row, c)] & STATE_SHIP)
                ) {
                c += offsetColumn;
            }

            if (c < WIDTH && c >= 0 && !(squares[flatten(injured.row, c)] & STATE_SHOT)) {
                result.push(flatten(injured.row, c));
            }

            return true;
        });
    } else {
        let allDirections = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ];

        allDirections.map(function(direction) {
            let r = injured.row + direction[0];
            let c = injured.column + direction[1];

            if (r >= 0 && r < HEIGHT && c >= 0 && c < WIDTH && !(squares[flatten(r, c)] & STATE_SHOT)) {
                result.push(flatten(r, c));
            }

            return true;
        });
    }

    return result;
}