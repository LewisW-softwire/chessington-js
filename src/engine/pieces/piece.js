export default class Piece {
    constructor(player) {
        this.player = player;
        this.firstmove = true;
    }

    getAvailableMoves(board) {
        throw new Error('This method must be implemented, and return a list of available moves');
    }

    moveTo(board, newSquare) {
        const currentSquare = board.findPiece(this);
        board.movePiece(currentSquare, newSquare);
        this.firstmove = false;
    }
}
