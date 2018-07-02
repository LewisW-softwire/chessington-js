import Piece from './piece';
import Square from '../square';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        for(let i = 0; i<=7; i++){
            if(i !== currentLocation.col){
                availableMoves.push(Square.at(currentLocation.row, i));
            }
            if(i !== currentLocation.row){
                availableMoves.push(Square.at(i, currentLocation.col));
            }
        }
        return availableMoves;
    }
}
