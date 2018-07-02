import Piece from './piece';
import Square from '../square';
import Board from '../board';

export default class Rook extends Piece {
    constructor(player) {
        super(player);
    }

    getAvailableMoves(board) {
        let currentLocation = board.findPiece(this);
        let availableMoves = [];
        let possibleDirections = [[1,0],[0,1],[-1,0],[0,-1]];
        for (let i=0;i<possibleDirections.length;i++)
        {
            for (let j=1;j<=7;j++)
            {
                let position = Square.at(currentLocation.row + possibleDirections[i][0]*j, currentLocation.col + possibleDirections[i][1] * j);
                if (! Board.validateSquare(position) || board.getPiece(position)) break;
                availableMoves.push(position);
            }
        }
        return availableMoves;
    }
}
