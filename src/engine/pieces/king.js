import Piece from './piece';
import Square from '../square';
import Board from '../board';

export default class King extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        for (let i = - 1; i <= 1; i++) {
            for (let j = - 1; j <= 1; j++) {
                if(i != 0 || j != 0){
                    let move = Square.at(currentLocation.row + i, currentLocation.col + j);
                    if(Board.validateSquare(move) && (!board.getPiece(move) || board.isTakingPiece(move, currentLocation))){
                        availableMoves.push(move);
                    }
                }
            }
        }
        return availableMoves;
    }
}
