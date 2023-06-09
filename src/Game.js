import Board from "./Board.js";
import Engine from "./AI/Engine.js";
import GUI from "./Gui.js";
import MoveGenerator from "./MoveGenerator.js";
import { isSquareAttacked } from "./helpers.js";
class Game{
    #boardObj;
    #gui;
    aiSide = 0;
    playerSide = 1;
    #moveGenerator; 
    #moves;
    #engine;
    #gameState='active'
    boardObj
    constructor()
    {
        
        this.#boardObj= new Board();
        this.#engine = new Engine(this.#boardObj);
        this.#moveGenerator= new MoveGenerator(this.#boardObj);
        this.#moves = this.#moveGenerator.getLegalMoves(this.#boardObj.side);
        
        this.#gui = new GUI(this);
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
        const engineMove = this.#engine.findNextMove(this.#moves);
        if(!engineMove)return;
        this.makeMove(engineMove); 
    }
    makeMove(move)
    {
        
        
        this.#boardObj.handleMove(move);
        this.#moves = this.#moveGenerator.getLegalMoves(this.#boardObj.side);
        this.#gui.renderBoard();
        
        this.#gui.soundHandler(move.type);
        if(this._isGameOver(this.#boardObj.side,this.#moves))return
    }
    getAllMoves(side)
    {
        if(side!=this.#boardObj.side)return;
        return this.#moves;
    }
    getPieceMoves(piecePos,side)
    {
        return this.#moves.filter((pos)=>pos.from==piecePos);
    }
    _isGameOver(side,moves)
    {
        if(moves.length>0)return;

        const kingPos = this.#boardObj.getKingPos(side);
        const winner = side==1?'black':'white';
        if(isSquareAttacked(kingPos,!side,this.#boardObj.getBoard()))
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