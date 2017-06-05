import React from 'react';

import LoadForm from './components/load-form';
import SavesList from './components/saves-list';
import Board from './components/board';
import {HEIGHT, WIDTH, SHIPS_SIZE_COUNT} from './../services/config';
import {STATE_SHIP, STATE_SHIP_KILLED, STATE_SHIP_NEAR, STATE_SHOT,
    GAME_STATE_PLACING_SHIPS, GAME_STATE_PLACING_AI_SHIPS, GAME_STATE_SHOOTING, GAME_STATE_AI_SHOOTING, GAME_STATE_WIN, GAME_STATE_LOSE} from  './../services/common';
import placeShips from './../services/auto-place-ships';
import checkPositionPossibility from './../services/check-possibility';
import generateCode from './../services/code-generator';
import shipShoot from './../services/shoot';
import shipShootAI from './../services/shoot-ai';
import checkWin from './../services/check-win';


/**
 * Game class. Main of the application. Battleship.
 */
export default class Game extends React.Component {
    /**
     * Class constructor. Preparing state.
     */
    constructor() {
        super();
        this.state = {
            gameState: GAME_STATE_PLACING_SHIPS,
            mySquares: Array(HEIGHT * WIDTH).fill(null),
            aiSquares: Array(HEIGHT * WIDTH).fill(null),
        };

        this.handleClickSave = this.handleClickSave.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleClickRestart = this.handleClickRestart.bind(this);
    }

    /**
     * Player cell click handler.
     *
     * @param i Cell number
     */
    handleClickOnMy(i) {
        if (this.state.gameState === GAME_STATE_PLACING_SHIPS) {
            let mySquares = this.state.mySquares;
            mySquares[i] = STATE_SHIP;

            let positionPossibility = checkPositionPossibility(mySquares);
            if (positionPossibility === -1) {
                mySquares[i] = null;
            }

            this.setState({
                mySquares: mySquares
            });

            if (positionPossibility === 1) {
                this.setState({
                    gameState: GAME_STATE_PLACING_AI_SHIPS,
                });

                let aiSquares = placeShips(Array(HEIGHT * WIDTH).fill(null), SHIPS_SIZE_COUNT);

                this.setState({
                    gameState: GAME_STATE_SHOOTING,
                    aiSquares: aiSquares,
                });
            }
        }
    }

    /**
     * AI cell click handler.
     *
     * @param i Cell number
     */
    handleClickOnAi(i) {
        if (this.state.gameState === GAME_STATE_SHOOTING) {
            let aiSquares = this.state.aiSquares;
            if ((aiSquares[i] & STATE_SHOT)
                || (aiSquares[i] & STATE_SHIP_NEAR)
                || (aiSquares[i] & STATE_SHIP_KILLED)
            ) {
                return;
            }

            aiSquares[i] = aiSquares[i] | STATE_SHOT;

            if (aiSquares[i] & STATE_SHIP) {
                shipShoot(aiSquares, i);
            }

            this.setState({
                aiSquares: aiSquares
            });

            if (aiSquares[i] & STATE_SHIP) {
                if (checkWin(aiSquares)) {
                    this.setState({
                        gameState: GAME_STATE_WIN,
                    });
                }
            } else {
                this.setState({
                    gameState: GAME_STATE_AI_SHOOTING,
                });
                let mySquares = this.state.mySquares;

                let that = this;
                setTimeout(aiShooting, 500);

                function aiShooting() {
                    let square = shipShootAI(mySquares);

                    if (square === null) {
                        that.setState({
                            gameState: GAME_STATE_LOSE,
                        });
                    } else {
                        mySquares[square] = mySquares[square] | STATE_SHOT;
                        if (mySquares[square] & STATE_SHIP) {
                            shipShoot(mySquares, square);
                            that.setState({
                                mySquares: mySquares,
                            });
                            setTimeout(aiShooting, 500);
                        } else {
                            that.setState({
                                mySquares: mySquares,
                                gameState: GAME_STATE_SHOOTING,
                            });
                        }
                    }
                }
            }
        }
    }

    /**
     * Save game click handler.
     */
    handleClickSave() {
        const mySquares = this.state.mySquares;
        const aiSquares = this.state.aiSquares;
        const saveString = JSON.stringify({
            mySquares: mySquares,
            aiSquares: aiSquares,
        });
        const code = generateCode();
        const dateTime = (new Date()).toString();
        let allSaves = localStorage.getItem('allSaves');
        if (allSaves == null) {
            allSaves = [];
        } else {
            allSaves = JSON.parse(allSaves);
        }
        allSaves.push({
            dateTime: dateTime,
            code: code,
        });
        localStorage.setItem(code, saveString);
        localStorage.setItem('allSaves', JSON.stringify(allSaves));
        alert(code);
    }

    /**
     * Load form submit handler.
     *
     * @param code Saving code
     */
    handleLoad(code) {
        let save = localStorage.getItem(code);
        if (save) {
            save = JSON.parse(save);
            this.setState({
                gameState: GAME_STATE_SHOOTING,
                mySquares: save.mySquares,
                aiSquares: save.aiSquares,
            });
        }
    }

    /**
     * Restart game click handler.
     */
    handleClickRestart() {
        this.setState({
            gameState: GAME_STATE_PLACING_SHIPS,
            mySquares: Array(HEIGHT * WIDTH).fill(null),
            aiSquares: Array(HEIGHT * WIDTH).fill(null),
        });
    }

    /**
     * Render the component.
     *
     * @returns {XML}
     */
    render() {
        const mySquares = this.state.mySquares;
        const aiSquares = this.state.aiSquares;
        let message = '';
        let extra = '';

        switch (this.state.gameState) {
            case GAME_STATE_PLACING_SHIPS:
                message = 'Please, place your ships on the board. You should go from biggest to smaller.';
                let allSaves = localStorage.getItem('allSaves');
                if (allSaves == null) {
                    allSaves = [];
                } else {
                    allSaves = JSON.parse(allSaves);
                }
                extra = <div>
                    <h2>Load game</h2>
                    <SavesList saves={allSaves}/>
                    <LoadForm handleLoad={this.handleLoad}/>
                </div>;
                break;
            case GAME_STATE_PLACING_AI_SHIPS:
                message = 'Please wait. AI ships are placing.';
                extra = <div>
                    <button onClick={this.handleClickSave}>Save game</button>
                </div>;
                break;
            case GAME_STATE_SHOOTING:
                message = 'Your turn. Please shoot on AI board.';
                extra = <button onClick={this.handleClickSave}>Save game</button>;
                break;
            case GAME_STATE_AI_SHOOTING:
                message = 'AI turn. Please wait.';
                break;
            case GAME_STATE_WIN:
                message = 'You win.';
                extra = <button onClick={this.handleClickRestart}>Restart game</button>;
                break;
            case GAME_STATE_LOSE:
                message = 'You loose.';
                extra = <button onClick={this.handleClickRestart}>Restart game</button>;
                break;
            default:
                break;
        }

        return (
            <div className="game">
                <p>{message}</p>
                <h2>Your board</h2>
                <div className="game-board">
                    <Board
                        type="my"
                        squares={mySquares}
                        onClick={i => this.handleClickOnMy(i)}
                    />
                </div>

                <h2>AI board</h2>
                <div className="game-board">
                    <Board
                        type="ai"
                        squares={aiSquares}
                        onClick={i => this.handleClickOnAi(i)}
                    />
                </div>
                {extra}
            </div>
        );
    }
}
