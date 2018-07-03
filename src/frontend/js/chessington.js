import Board from '../../engine/board';
import GameSettings from '../../engine/gameSettings';
import Player from '../../engine/player';
import Square from '../../engine/square';
import Pawn from '../../engine/pieces/pawn';
import Rook from '../../engine/pieces/rook';
import Knight from '../../engine/pieces/knight';
import Bishop from '../../engine/pieces/bishop';
import Queen from '../../engine/pieces/queen';
import King from '../../engine/pieces/king';

let boardUI;
let board;

function squareToPositionString(square) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return letters[square.col] + (square.row + 1).toString();
}

function positionStringToSquare(positionString) {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    return Square.at(parseInt(positionString.charAt(1), 10) - 1, letters.indexOf(positionString.charAt(0)));
}

function pieceToPieceString(piece) {
    const playerString = piece.player === Player.WHITE ? 'w' : 'b';

    if (piece instanceof Pawn) {
        return playerString + 'P'
    } else if (piece instanceof Rook) {
        return playerString + 'R'
    } else if (piece instanceof Knight) {
        return playerString + 'N'
    } else if (piece instanceof Bishop) {
        return playerString + 'B'
    } else if (piece instanceof Queen) {
        return playerString + 'Q'
    } else if (piece instanceof King) {
        return playerString + 'K'
    }
}

function boardToPositionObject() {
    let position = {};
    for (let row = 0; row < GameSettings.BOARD_SIZE; row++) {
        for (let col = 0; col < GameSettings.BOARD_SIZE; col++) {
            const square = Square.at(row, col);
            const piece = board.getPiece(square);

            if (!!piece) {
                position[squareToPositionString(square)] = pieceToPieceString(piece);
            }
        }
    }
    return position;
}

function onDragStart(source, piece, position, orientation) {
    return (board.currentPlayer === Player.WHITE && piece.search(/^w/) !== -1) ||
        (board.currentPlayer === Player.BLACK && piece.search(/^b/) !== -1);
}

function onDrop(source, target) {
    const fromSquare = positionStringToSquare(source);
    const toSquare = positionStringToSquare(target);
    const pieceToMove = board.getPiece(fromSquare);

    if (!pieceToMove || !pieceToMove.getAvailableMoves(board).some(square => square.equals(toSquare))) {
        return 'snapback';
    }
    pieceToMove.moveTo(board, toSquare);
    updateStatus();
    blackMove(board);
}

function blackMove(board) {
    let availableMoves = [];

    for (let i = 0; i <= 7; i++) {
        for (let j = 0; j <= 7; j++) {
            let piece = board.getPiece(Square.at(i, j));
            if (piece && board.currentPlayer === piece.player && piece.getAvailableMoves(board).length) {
                availableMoves.push([Square.at(i, j), piece.getAvailableMoves(board)]);
            }
        }
    }
    if (availableMoves.length) {
        let randomPiece = Math.floor(Math.random() * availableMoves.length);
        const pieceToMove = board.getPiece(availableMoves[randomPiece][0]);
        let randomMove = Math.floor(Math.random() * availableMoves[randomPiece][1].length);
        pieceToMove.moveTo(board, availableMoves[randomPiece][1][randomMove]);
    }
    updateStatus();
}

function onSnapEnd() {
    boardUI.position(boardToPositionObject(board));
}

function updateStatus() {
    const player = board.currentPlayer === Player.WHITE ? 'White' : 'Black';
    let innerHTML = `${player} to move`;
    if (board.isCheckmate) {
        innerHTML = 'Checkmate!';
    } else if (board.isStalemate) {
        innerHTML = 'Stalemate!';
    } else if (board.isCheck) {
        innerHTML += ', Check!'
    }
    document.getElementById('turn-status').innerHTML = innerHTML;
}

function boardInStartingPosition() {
    let board = new Board();

    for (let i = 0; i < GameSettings.BOARD_SIZE; i++) {
        board.setPiece(Square.at(1, i), new Pawn(Player.WHITE));
        board.setPiece(Square.at(6, i), new Pawn(Player.BLACK));
    }

    for (let i of [0, 7]) {
        board.setPiece(Square.at(0, i), new Rook(Player.WHITE));
        board.setPiece(Square.at(7, i), new Rook(Player.BLACK));
    }

    for (let i of [1, 6]) {
        board.setPiece(Square.at(0, i), new Knight(Player.WHITE));
        board.setPiece(Square.at(7, i), new Knight(Player.BLACK));
    }

    for (let i of [2, 5]) {
        board.setPiece(Square.at(0, i), new Bishop(Player.WHITE));
        board.setPiece(Square.at(7, i), new Bishop(Player.BLACK));
    }

    board.setPiece(Square.at(0, 3), new Queen(Player.WHITE));
    board.setPiece(Square.at(7, 3), new Queen(Player.BLACK));

    board.setPiece(Square.at(0, 4), new King(Player.WHITE));
    board.setPiece(Square.at(7, 4), new King(Player.BLACK));

    return board;
}

export function createChessBoard() {
    board = boardInStartingPosition();
    boardUI = ChessBoard(
        'chess-board',
        {
            showNotation: false,
            draggable: true,
            position: boardToPositionObject(board),
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        }
    );
    updateStatus();
}
