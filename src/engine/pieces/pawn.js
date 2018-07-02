import Piece from './piece';
import Square from '../square';
import Player from '../player';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        if(this.player === Player.WHITE){
            let squareAhead = Square.at(currentLocation.row+1, currentLocation.col);
            let squareTwoAhead = Square.at(currentLocation.row+2, currentLocation.col);
            if (!board.getPiece(squareAhead)){
                availableMoves = [squareAhead];
                if (this.firstmove && !board.getPiece(squareTwoAhead)) availableMoves.push(squareTwoAhead);
            }
        }else{
            let squareAhead = Square.at(currentLocation.row-1, currentLocation.col);
            let squareTwoAhead = Square.at(currentLocation.row-2, currentLocation.col);
            if (!board.getPiece(squareAhead)){
                availableMoves = [squareAhead];
                if (this.firstmove && !board.getPiece(squareTwoAhead)) availableMoves.push(squareTwoAhead);
            }
        }
        return availableMoves;
    }
}
