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
            let res = [Square.at(currentLocation.row+1, currentLocation.col)];
            if (this.firstmove) res.push(Square.at(currentLocation.row+2, currentLocation.col));
            return res;
        }else{
            let res = [Square.at(currentLocation.row-1, currentLocation.col)];
            if (this.firstmove) res.push(Square.at(currentLocation.row-2, currentLocation.col));
            return res;
        }
    }
}
