import {HEIGHT, WIDTH} from  './config';
import {STATE_SHIP, STATE_SHOT, STATE_SHIP_NEAR, STATE_SHIP_KILLED} from './common';
import {flatten, unflatten} from './common';

/**
 * Shoot on position
 * @param squares
 * @param i
 */
export default function shipShoot(squares, i) {
    let cell = unflatten(i);
    let allDirections = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    let killed = true;

    allDirections.map(function(direction) {
        let r = cell.row;
        let c = cell.column;
        while ((squares[flatten(r, c)] & STATE_SHIP) && (squares[flatten(r, c)] & STATE_SHOT)) {
            c += direction[0];
            r += direction[1];
            if (c >= WIDTH || c < 0 || r >= HEIGHT || r < 0) {
                break;
            }
        }

        if (c < WIDTH && c >= 0 && r < HEIGHT && r >= 0 && (squares[flatten(r, c)] & STATE_SHIP)) {
            killed = false;
        }
        return true;
    });

    if (killed) {
        allDirections.map(function(direction) {
            let r = cell.row;
            let c = cell.column;
            while (squares[flatten(r, c)] & STATE_SHIP) {
                squares[flatten(r, c)] = squares[flatten(r, c)] | STATE_SHIP_KILLED;
                markShipRound(squares, r, c);

                c += direction[0];
                r += direction[1];
                if (c >= WIDTH || c < 0 || r >= HEIGHT || r < 0) {
                    break;
                }
            }
            return true;
        });
    }
}

/**
 * Mark around of the ship by STATE_SHIP_NEAR
 * @param squares
 * @param row
 * @param column
 */
function markShipRound(squares, row, column) {
    let allDirections = [
        [1, -1],
        [1, 0],
        [1, 1],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
    ];

    allDirections.map(function(direction) {
        let c = column + direction[0];
        let r = row + direction[1];

        if (c < WIDTH && c >= 0 && r < HEIGHT && r >= 0 && !(squares[flatten(r, c)] & STATE_SHIP)) {
            squares[flatten(r, c)] = squares[flatten(r, c)] | STATE_SHIP_NEAR;
        }
        return true;
    });
}
