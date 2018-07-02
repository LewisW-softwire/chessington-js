import Piece from './piece';
import Square from '../square';
import Board from '../board';

export default class Knight extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        for (let i = - 2; i <= 2; i++) {
            for (let j = - 2; j <= 2; j++) {
                if(Math.abs(i*j) === 2){
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
