import Piece from './piece';
import Square from '../square';
import Player from '../player';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        if(this.player === Player.WHITE){
            return [Square.at(currentLocation.row+1, currentLocation.col)];
        }else{
            return [Square.at(currentLocation.row-1, currentLocation.col)];
        }
    }
}
