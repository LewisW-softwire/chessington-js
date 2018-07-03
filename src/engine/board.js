import Player from './player';
import GameSettings from './gameSettings';
import Square from './square';
import Rook from './pieces/rook';

export default class Board {
    constructor(currentPlayer) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.pseudoPawn = null;
    }

    createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }

    setPiece(square, piece) {
        this.board[square.row][square.col] = piece;
    }

    getPiece(square) {
        return this.board[square.row][square.col];
    }

    findPiece(pieceToFind) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    movePiece(fromSquare, toSquare) {
        const movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {
            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }
    }

    static isOnBoard(square) {
        return square.row >= 0 && square.col >= 0 && square.row <= 7 && square.col <= 7;
    }

    isTakingPiece(position, currentLocation) {
        return this.getPiece(position).player !== this.getPiece(currentLocation).player && !this.getPiece(position).checkType("King");
    }

    getCheckedSquares(player) {
        let newBoard = this;
        let kingSquare = this.getKingSquare(player);
        let kingReplaced = false;
        let kingPiece = null;
        if (kingSquare) {
            kingPiece = this.getPiece(kingSquare);
            newBoard.setPiece(this.getKingSquare(player), new Rook(player));
            kingReplaced = true;
        }
        let opposingMoves = [];

        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                if (newBoard.getPiece(Square.at(i, j)) && newBoard.getPiece(Square.at(i, j)).player !== player) {
                    opposingMoves = opposingMoves.concat(newBoard.getPiece(Square.at(i, j)).getControlledSquares(newBoard));
                }
            }
        }
        if (kingReplaced) {
            newBoard.setPiece(kingSquare, kingPiece);
        }
        return uniq(opposingMoves);

        function uniq(a) {
            var seen = {};
            return a.filter(function (item) {
                return seen.hasOwnProperty(item) ? false : (seen[item] = true);
            });
        }
    }

    removeCheckedMoves(player, moves, currentLocation) {
        //Need to store the position of the king and change the rook back afterwards (or find a way to properly clone an object)
        for (let i = 0; i < moves.length; i++) {
            let nextBoard = this;
            //Store the state of the board so that it can be changed back at the end of the test
            let prevPiece = nextBoard.getPiece(moves[i]);
            //Simulate the move and check which squares are under check
            this.forceMovePiece(currentLocation, moves[i]);
            let kingSquare = nextBoard.getKingSquare(player);

            let checkedSquares = nextBoard.getCheckedSquares(player);
            //Reset board to it's previous state after getting the checked squares
            nextBoard.forceMovePiece(moves[i], currentLocation);
            nextBoard.setPiece(moves[i], prevPiece);
            if (!kingSquare) {
                return moves;
            }
            if (Square.isSquareInArray(kingSquare, checkedSquares)) {
                moves.splice(i, 1);
                i--;
            }

        }
        return moves;
    }


    getKingSquare(player) {
        for (let i = 0; i <= 7; i++) {
            for (let j = 0; j <= 7; j++) {
                if (this.getPiece(Square.at(i, j)) && this.getPiece(Square.at(i, j)).player === player && this.getPiece(Square.at(i, j)).constructor.name === "King") {
                    return Square.at(i, j);
                }
            }
        }
        return null;
    }

    forceMovePiece(currentLocation, targetLocation) {
        const movingPiece = this.getPiece(currentLocation);
        this.setPiece(targetLocation, movingPiece);
        this.setPiece(currentLocation, undefined);
    }

}
