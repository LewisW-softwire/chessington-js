import Piece from './piece';
import Square from '../square';
import Player from '../player';
import Board from '../board';
import Queen from './queen';

export default class Pawn extends Piece {
    constructor(player) {
        super(player);
    }

    pawnTakingPiece(board, position)
    {
        return Board.isOnBoard(position) && ((board.getPiece(position) && (board.getPiece(position).player !== this.player) && (board.getPiece(position).constructor.name != "King")) || (board.pseudoPawn && position.equals(board.pseudoPawn)));
    }

    getControlledSquares(board) {
        //taking pieces
        let controlledSquares = [];
        let currentLocation = board.findPiece(this);
        let direction = this.player === Player.WHITE ? 1 : -1;

        let squareAheadLeft = Square.at(currentLocation.row + direction, currentLocation.col-1);
        let squareAheadRight = Square.at(currentLocation.row + direction, currentLocation.col+1);
        if (Board.isOnBoard(squareAheadLeft)) {
            controlledSquares.push(squareAheadLeft);
        }
        if (Board.isOnBoard(squareAheadRight)) {
            controlledSquares.push(squareAheadRight);
        }
        return controlledSquares;
    }

    //Fundamentally, the controlled squares and available moves of pawns are two different concepts (which is not the case for other pieces)
    getAvailableMoves(board){
        let currentLocation = board.findPiece(this);
        let availableMoves = [];

        let direction = this.player === Player.WHITE ? 1 : -1;
        let squareAhead = Square.at(currentLocation.row + direction, currentLocation.col);
        let squareTwoAhead = Square.at(currentLocation.row + (direction * 2), currentLocation.col);

        //move
        if (Board.isOnBoard(squareAhead) && !board.getPiece(squareAhead)) {
            availableMoves = [squareAhead];
            if (Board.isOnBoard(squareTwoAhead) && this.firstmove && !board.getPiece(squareTwoAhead)) availableMoves.push(squareTwoAhead);
        }

        let squareAheadLeft = Square.at(currentLocation.row + direction, currentLocation.col-1);
        let squareAheadRight = Square.at(currentLocation.row + direction, currentLocation.col+1);
        if (this.pawnTakingPiece(board,squareAheadLeft)) {
            availableMoves.push(squareAheadLeft);
        }
        if (this.pawnTakingPiece(board,squareAheadRight)) {
            availableMoves.push(squareAheadRight);
        }

        return board.removeCheckedMoves(this.player,availableMoves,board.findPiece(this));
    }
    
    moveTo(board, newSquare) {
        const currentSquare = board.findPiece(this);
        //En passant
        if (newSquare.equals(board.pseudoPawn))
        {
            let realPawnLocation = null;
            if (newSquare.row === 2) {
                realPawnLocation = Square.at(3, newSquare.col);
            } else {
                realPawnLocation = Square.at(4, newSquare.col);
            }
            board.setPiece(realPawnLocation, undefined);
        }
        board.pseudoPawn = null;
        board.movePiece(currentSquare, newSquare);
        this.firstmove = false;
        if (Math.abs(newSquare.row - currentSquare.row) === 2){
            board.pseudoPawn = Square.at((newSquare.row + currentSquare.row) / 2, currentSquare.col);
        }
        if(newSquare.row === 0 || newSquare.row === 7){
            board.setPiece(newSquare, new Queen(this.player));
        }
        board.updateCheck();
    }

}
