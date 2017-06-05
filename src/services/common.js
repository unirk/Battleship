import {WIDTH} from './config';

// Square states constants.
export const STATE_SHIP = 1;
export const STATE_SHIP_KILLED = 2;
export const STATE_SHIP_NEAR = 4;
export const STATE_SHOT = 8;

// Game state constants.
export const GAME_STATE_PLACING_SHIPS = 1;
export const GAME_STATE_PLACING_AI_SHIPS = 2;
export const GAME_STATE_SHOOTING = 3;
export const GAME_STATE_AI_SHOOTING = 4;
export const GAME_STATE_WIN = 5;
export const GAME_STATE_LOSE = 6;

/**
 * Flatten row and column to cell number.
 *
 * @param row
 * @param column
 * @returns {*}
 */
function flatten(row, column) {
    return row * WIDTH + column;
}

/**
 * Unflatten cell number to row and column.
 *
 * @param cellNumber
 * @returns {{row: number, column: number}}
 */
function unflatten(cellNumber) {
    let row = Math.floor(cellNumber / WIDTH);
    let column = cellNumber - row * WIDTH;
    return {row: row, column: column};
}

export {flatten, unflatten};