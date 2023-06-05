import Board from "./Board.js";
import Engine from "./Engine.js";
import GUI from "./Gui.js";
import MoveGenerator from "./MoveGenerator.js";
import { SQ120TO64, SQ64TO120 } from "./helpers.js";
import { Queen } from "./pieces.js";
import {  getHashKey } from "./OpeningBook/Zobrist.js";
class Game{
    #boardObj;
    #gui;
    aiSide = 1;
    playerSide = 1;
    #turn=1;//1-white  0-black
    #moveGenerator; 
    #moves;
    #engine;
    #gameState='active'
    constructor()
    {
        this.#engine = new Engine();
        this.#boardObj= new Board();
        this.#moveGenerator= new MoveGenerator(this.#boardObj);
        this.#moves = this.#moveGenerator.getLegalMoves(this.#turn);
        this.#gui = new GUI(this);
        getHashKey(this.#boardObj.getBoard(),"KQkq","-",1);
    }
    getBoard()
    {
        return this.#boardObj.getBoard();
    }
    playOneTurn(playerMove)
    {
        //white 
        this.makeMove(playerMove)

        //black
        // const engineMove = this.#engine.findNextMove(this.#moves);
        // if(!engineMove)return;
        // this.makeMove(engineMove); 
    }
    makeMove(move)
    {
        const a = 0x2AF7398005AAA5C;
        const b = 0x3290AC3A203001BF
        console.log(a^b);
        console.log(move);
        if(move.type=='castling')
        {
            const kingPos = move.from;
            if(move.side=='King')this.#boardObj.makeMove({from:kingPos+3,to:kingPos+1});
            else this.#boardObj.makeMove({from:kingPos-4,to:kingPos-1});
        }
        else if(move.type=='twoSquarePawnMove')
        {
            this._addPossibleEnPassants(move);
        }
        else if(move?.enPassantPiece)
        {
            this.#boardObj.killPiece(move.enPassantPiece);
        }
        else if(move.type=='promotion')
        {
            console.log('test')
            this.#boardObj.killPiece(move.from);
            const piece = new Queen(this.#turn,move.from);
            console.log(piece);
            this.#boardObj.addNewPiece(move.from,piece);
        }
        
        this.#boardObj.makeMove(move);
        this.#turn = this.#turn==1?0:1;
        this.#moves = this.#moveGenerator.getLegalMoves(this.#turn);
        this.#gui.renderBoard();
        this.#gui.soundHandler(move.type);
        if(this._isGameOver(this.#turn,this.#moves))return
    }
    _addPossibleEnPassants(move)
    {
        const board = this.#boardObj.getBoard();
        const leftNbrPos120 = SQ64TO120[move.to]-1;
        const rightNbrPos120 = SQ64TO120[move.to]+1;

        const leftNbrPos64 = SQ120TO64[leftNbrPos120];
        const rightNbrPos64 = SQ120TO64[rightNbrPos120];

        const color = board[move.from].isWhite?-1:1;
        if(leftNbrPos64!=-1&&board[leftNbrPos64]?.type=='Pawn'&&board[move.from].isWhite!=board[leftNbrPos64].isWhite)
        {
            const newMove = {from:leftNbrPos64,to:move.from+8*color,type:'capture',enPassantPiece:move.to}
            board[leftNbrPos64].possibleEnPassant.push(newMove);  
        }

        if(rightNbrPos64!=-1&&board[rightNbrPos64]?.type=='Pawn'&&board[move.from].isWhite!=board[rightNbrPos64].isWhite)
        {
            const newMove = {from:rightNbrPos64,to:move.from+8*color,type:'capture',enPassantPiece:move.to}
            board[rightNbrPos64].possibleEnPassant.push(newMove);    
        }

    }
    getAllMoves(side)
    {
        if(side!=this.#turn)return;
        return this.#moves;
    }
    getPieceMoves(piecePos,side)
    {
        //return this.#moves.filter((pos)=>pos.from==piecePos&&side==this.#turn);
        return this.#moves.filter((pos)=>pos.from==piecePos);
    }
    _isGameOver(side,moves)
    {
        if(moves.length>0)return;

        const kingPos = this.#boardObj.getKingPos(side);
        const winner = side==1?'black':'white';
        if(this.#moveGenerator.isSquareAttacked(kingPos,!side,this.#boardObj.getBoard()))
        {
            this.#gameState = winner;
        }
        else{
            this.#gameState = `draw`;
        }
        this.#gui.gameOverState(this.#gameState);
    }
}
let game = new Game();
const resetBtn = document.querySelector(".reset-btn");
resetBtn.addEventListener('click',resetGame);
function resetGame(){
    game = new Game();
}