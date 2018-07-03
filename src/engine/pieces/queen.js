import Piece from './piece';
import Square from '../square';

export default class Queen extends Piece {
    constructor(player) {
        super(player);
    }

    getControlledSquares(board) {
        let possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        return Piece.getLineMoves(board, possibleDirections, board.findPiece(this));
    }
}
