import Piece from './piece';
import Square from '../square';
import Board from '../board';

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    getControlledSquares(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i != 0 || j != 0) {
                    let move = Square.at(currentLocation.row + i, currentLocation.col + j);
                    if (Board.isOnBoard(move) && (!board.getPiece(move) || board.isTakingPiece(move, currentLocation))) {
                        availableMoves.push(move);
                    }/*
                    if (!Board.isOnBoard(move)) { continue; }

                    let moveIsCapture = !!board.getPiece(move);

                    if (!moveIsCapture) {
                        availableMoves.push(move);
                        continue;
                    }

                    if (board.isValidCapture(move, currentLocation)) {
                        availableMoves.push(move);
                        continue;
                    }*/
                }
            }
        }
        return availableMoves;
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let normalMoves = board.removeCheckedMoves(this.player, this.getControlledSquares(board), board.findPiece(this));
        let castlingMoves = [];
        if (this.checkCastling(1, board)) {
            castlingMoves.push(Square.at(currentLocation.row, currentLocation.col + 2));
        }
        if (this.checkCastling(-1, board)) {
            castlingMoves.push(Square.at(currentLocation.row, currentLocation.col - 2));
        }
        return normalMoves.concat(castlingMoves);
    }

    checkCastling(direction, board) {
        let currentLocation = board.findPiece(this);
        let controlledSquares = board.getCheckedSquares(this.player);
        let rookPosition = Square.at(currentLocation.row, direction === 1 ? 7 : 0);
        let rook = board.getPiece(rookPosition);

        if (this.firstmove && !Square.isSquareInArray(currentLocation, controlledSquares)) {
            if (rook && rook.firstmove && rook.checkType("Rook")) {
                let checkPosition = currentLocation;
                checkPosition.col += direction;
                if (Square.isSquareInArray(checkPosition, controlledSquares) ||
                    Square.isSquareInArray(Square.at(checkPosition.row, checkPosition.col + direction), controlledSquares)) {
                    return false;
                }
                while (Board.isOnBoard(checkPosition) && !checkPosition.equals(rookPosition)) {
                    if (board.getPiece(checkPosition)) {
                        return false;
                    } else {
                        checkPosition.col += direction;
                    }
                }
                if (!Board.isOnBoard(checkPosition)) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    moveTo(board, newSquare) {
        let currentLocation = board.getKingSquare(board.currentPlayer);
        super.moveTo(board, newSquare);
        if (Math.abs(currentLocation.col - newSquare.col) == 2) {
            let direction = (newSquare.col - currentLocation.col) / 2;
            let rookPosition = Square.at(currentLocation.row, direction === 1 ? 7 : 0);
            //Move the rook to the location behind the king
            //ForceMovePiece is required because the current player will change after the king moves which would
            //prevent the normal movePiece method from moving the rook.
            console.log("forcemovepiece");
            console.log(rookPosition);
            board.forceMovePiece(rookPosition, Square.at(newSquare.row, newSquare.col - direction));
        }
        board.updateCheck();
    }

}
