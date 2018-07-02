import Square from '../square';
import Board from '../board';

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

    static getLineMoves(board, directions, currentLocation) {
        let availableMoves = [];
        for (let i = 0; i < directions.length; i++) {
            for (let j = 1; j <= 7; j++) {
                let position = Square.at(currentLocation.row + directions[i][0] * j, currentLocation.col + directions[i][1] * j);
                if (!Board.validateSquare(position) || board.getPiece(position)) break;
                availableMoves.push(position);
            }
        }
        return availableMoves;
    }
}
