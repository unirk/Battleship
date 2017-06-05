import {STATE_SHIP, STATE_SHOT} from  './common';

/**
 * Check not having not killed ships.
 *
 * @param squares
 * @returns {boolean}
 */
export default function checkWin(squares) {
    for (let square of squares) {
        if ( (square & STATE_SHIP) && !(square & STATE_SHOT)) {
            return false;
        }
    }

    return true;
}
