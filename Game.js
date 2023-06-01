import Board from "./Board.js";
import MoveGenerator from "./MoveGenerator.js";
export default class Game{
    #boardObj;
    #turn=1;//1-white  0-black
    #moveGenerator; 
    #moves;
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
    }
    getPieceMoves(piecePos)
    {
        return this.#moves.filter((pos)=>pos.from==piecePos);
    }
}