import Piece from './piece';
import Board from '../board';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getControlledSquares(board){
        let possibleDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        return Piece.getLineMoves(board, possibleDirections, board.findPiece(this));
    }
}
