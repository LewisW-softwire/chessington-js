import Piece from './piece';
import Square from '../square';
import Player from '../player';
import Board from '../board';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];

        let direction = this.player === Player.WHITE ? 1 : -1;
        let squareAhead = Square.at(currentLocation.row + direction, currentLocation.col);
        let squareTwoAhead = Square.at(currentLocation.row + (direction * 2), currentLocation.col);
        if (Board.validateSquare(squareAhead) && !board.getPiece(squareAhead)) {
            availableMoves = [squareAhead];
            if (Board.validateSquare(squareTwoAhead) && this.firstmove && !board.getPiece(squareTwoAhead)) availableMoves.push(squareTwoAhead);
        }
        return availableMoves;
    }
}
