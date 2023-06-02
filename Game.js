import Board from "./Board.js";
import MoveGenerator from "./MoveGenerator.js";
export default class Game{
    #boardObj;
    #turn=1;//1-white  0-black
    #moveGenerator; 
    #moves;
    #gameState='active'
    constructor()
    {
       
        this.#boardObj= new Board();
        this.#moveGenerator= new MoveGenerator(this.#boardObj);
        this.#moves = this.#moveGenerator.getLegalMoves(this.#turn);
    }
    getBoard()
    {
        return this.#boardObj.getBoard();
    }
    movePiece(move)
    {
        this.#turn = this.#turn==1?0:1;
        this.#boardObj.makeMove(move);
        this.#moves = this.#moveGenerator.getLegalMoves(this.#turn);
        this._checkGameState(this.#turn,this.#moves);
    }
    getPieceMoves(piecePos)
    {
        return this.#moves.filter((pos)=>pos.from==piecePos);
    }
    _checkGameState(side,moves)
    {
        if(moves.length>0)return;

        const kingPos = this.#boardObj.getKingPos(side);
        const winner = side==1?'Black':'White';
        if(this.#moveGenerator.isSquareAttacked(kingPos,!side,this.#boardObj.getBoard()))
        {
            this.#gameState = `${winner} wins`;
        }
        else{
            this.#gameState = `Draw`;
        }
    }
    getGameState()
    {
        return this.#gameState
    }
}