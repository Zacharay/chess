import { KING_DIR,KNIGHT_DIR,BISHOP_DIR,ROCK_DIR } from "./helpers.js";
import { SQ120TO64,SQ64TO120 ,isSquareAttacked} from "./helpers.js";
export default class MoveGenerator{
    #boardObj;
    constructor(board){
        this.#boardObj = board;
    }
    getLegalMoves()
    {
        const side = this.#boardObj.side; 
        
        const legalMoves = [];
        const board = this.#boardObj.getBoard();

        const pseudoLegalMoves = this._generatePseudoLegalMoves(side,board);
        pseudoLegalMoves.forEach((moveToCheck)=>{
            if(moveToCheck.type=='castling'){
                legalMoves.push(moveToCheck);
                return;
            }
            //make move
            const prevVal = this.makeMove(moveToCheck,board);

            const kingPos = this.#boardObj.getKingPos(side);
            //check if legal
            if(!isSquareAttacked(kingPos,!side,board))
            {
                legalMoves.push(moveToCheck);
            }
            //unmake move
            this.unmakeMove(moveToCheck,prevVal,board);
        })
        
        return legalMoves;
    }
    _generatePseudoLegalMoves(side,board)
    {     
        let moves=[];
        board.forEach(piece=>{
            if(piece.isWhite==side)
            {
                const pieceMoves = piece.generateMoves(board,isSquareAttacked);
                if(pieceMoves.length==0)return;

              
                moves.push(...pieceMoves);
            }
        })
       return moves;
    }
    makeMove(move,board){

        board[move.from].movePiece(move.to);

        const pieceOnCapturedSquare =board[move.to];
        
        board[move.to]=board[move.from];
        board[move.from]='';

        return  pieceOnCapturedSquare;
    }
    unmakeMove(move,prevVal,board)
    {    
        board[move.to].movePiece(move.from); 

        board[move.from]=board[move.to];
        board[move.to]=prevVal;
    }
}