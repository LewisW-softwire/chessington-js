import Piece from './piece';
import Square from '../square';

export default class Bishop extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        let diff = currentLocation.row - currentLocation.col;
        let sum = currentLocation.row + currentLocation.col;
        for (let i = 0; i <= sum; i++) {
            if (i != currentLocation.row) {
                availableMoves.push(Square.at(i, sum - i));
            }
        }
        for (let i = 0; i <= 7; i++) {
            if (i - diff >= 0 && i - diff <= 7 && i != currentLocation.row) {
                availableMoves.push(Square.at(i, i - diff));
            }
        }

        return availableMoves;
    }
}
