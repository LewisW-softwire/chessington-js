import 'chai/register-should';
import King from '../../../src/engine/pieces/king';
import Pawn from '../../../src/engine/pieces/pawn';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Rook from '../../../src/engine/pieces/rook';
import Bishop from '../../../src/engine/pieces/bishop';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

describe('King', () => {

    let board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.deep.have.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it ('cannot leave king checked', () => {
        const whiteKing = new King(Player.WHITE);
        const blackKing = new King(Player.BLACK);
        const whitePawn = new Pawn(Player.WHITE);
        const blackPawn = new Pawn(Player.BLACK);
        board.setPiece(Square.at(3, 3), whiteKing);
        board.setPiece(Square.at(4, 3), blackKing);
        board.setPiece(Square.at(3, 4), whitePawn);
        board.setPiece(Square.at(4, 5), blackPawn);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.have.length(3);
        moves.should.deep.include(Square.at(2, 3));
        moves.should.deep.include(Square.at(2, 2));
        moves.should.deep.include(Square.at(2, 4));
    });

    it ('cannot castle if not first move', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackRook = new Rook(Player.BLACK);
        board.setPiece(Square.at(1, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);
        board.setPiece(Square.at(7, 7), blackRook);

        whiteKing.moveTo(board, Square.at(0, 4));
        blackRook.moveTo(board, Square.at(7, 0));

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 6));
        moves.should.have.length(5);
    });

    it ('cannot castle if there is a piece in between', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackBishop = new Bishop(Player.BLACK);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);
        board.setPiece(Square.at(0, 5), blackBishop);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 6));
    });

    it ('cannot castle if squares in between are checked', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackRook = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);
        board.setPiece(Square.at(7, 5), blackRook);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 6));
    });

    it ('cannot castle if king is in check', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackRook = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);
        board.setPiece(Square.at(7, 4), blackRook);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(0, 6));
    });
    

    it ('can castle even if rook is in check', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackRook = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);
        board.setPiece(Square.at(7, 7), blackRook);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.deep.include(Square.at(0, 6));
    });
    
    it ('can castle even if square beyond movement is in check', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        const blackRook = new Rook(Player.BLACK);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 0), whiteRook);
        board.setPiece(Square.at(7, 1), blackRook);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.deep.include(Square.at(0, 2));
    });

    it ('king should be able to castle', () => {
        const whiteKing = new King(Player.WHITE);
        const whiteRook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), whiteKing);
        board.setPiece(Square.at(0, 7), whiteRook);

        const moves = whiteKing.getAvailableMoves(board);

        moves.should.deep.include(Square.at(0, 6));
    });
});
