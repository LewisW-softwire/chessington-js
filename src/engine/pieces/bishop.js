import Piece from './piece';
import Square from '../square';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let possibleDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        return Piece.getLineMoves(board, possibleDirections, board.findPiece(this));
    }
}
