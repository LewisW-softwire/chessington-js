import Piece from './piece';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let possibleDirections = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        return Piece.getLineMoves(board, possibleDirections, board.findPiece(this));
    }
}
