import Piece from './piece';
import Square from '../square';
import Player from '../player';
import Board from '../board';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    pawnTakingPiece(board, position)
    {
        return Board.validateSquare(position) && board.getPiece(position) && (board.getPiece(position).player !== this.player) && (board.getPiece(position).constructor.name != "King");
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];

        let direction = this.player === Player.WHITE ? 1 : -1;
        let squareAhead = Square.at(currentLocation.row + direction, currentLocation.col);
        let squareTwoAhead = Square.at(currentLocation.row + (direction * 2), currentLocation.col);

        //move
        if (Board.validateSquare(squareAhead) && !board.getPiece(squareAhead)) {
            availableMoves = [squareAhead];
            if (Board.validateSquare(squareTwoAhead) && this.firstmove && !board.getPiece(squareTwoAhead)) availableMoves.push(squareTwoAhead);
        }

        //taking pieces
        let squareAheadLeft = Square.at(currentLocation.row + direction, currentLocation.col-1);
        let squareAheadRight = Square.at(currentLocation.row + direction, currentLocation.col+1);
        if (this.pawnTakingPiece(board,squareAheadLeft)) {
            availableMoves.push(squareAheadLeft);
        }
        if (this.pawnTakingPiece(board,squareAheadRight)) {
            availableMoves.push(squareAheadRight);
        }
        return availableMoves;
    }
}
