import Board from "./Board.js";
import Engine from "./Engine.js";
import GUI from "./Gui.js";
import MoveGenerator from "./MoveGenerator.js";
class Game{
    #boardObj;
    #gui;
    aiSide = 0;
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
        this.#boardObj.makeMove(move);
        
        this.#turn = this.#turn==1?0:1;
        this.#moves = this.#moveGenerator.getLegalMoves(this.#turn);
        this.#gui.renderBoard();
        this.#gui.soundHandler(move.type);
        if(this._isGameOver(this.#turn,this.#moves))return
    }
    getAllMoves(side)
    {
        if(side!=this.#turn)return;
        return this.#moves;
    }
    getPieceMoves(piecePos,side)
    {
        return this.#moves.filter((pos)=>pos.from==piecePos&&side==this.#turn);
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