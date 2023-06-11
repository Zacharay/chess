import { KING_DIR,KNIGHT_DIR,BISHOP_DIR,ROCK_DIR } from "./helpers.js";
import { SQ120TO64,SQ64TO120 } from "./helpers.js";
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
            if(!this.isSquareAttacked(kingPos,!side,board))
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
                const pieceMoves = piece.generateMoves(board,this.isSquareAttacked);
                if(pieceMoves.length==0)return;

              
                moves.push(...pieceMoves);
            }
        })
       return moves;
    }
    isSquareAttacked(sq,side,board)
    {
        sq = SQ64TO120[sq];
        
        //white side Pawns
        if(side)
        {
            if(
                (board[SQ120TO64[sq+9]]?.type=='Pawn'&&board[SQ120TO64[sq+9]]?.isWhite==side)||
                (board[SQ120TO64[sq+11]]?.type=='Pawn'&&board[SQ120TO64[sq+11]]?.isWhite==side))
            {
                return true;
            }
        }
        //Black side pawns
        else{
            if(
            (board[SQ120TO64[sq-9]]?.type=='Pawn'&&board[SQ120TO64[sq-9]]?.isWhite==side)||
            (board[SQ120TO64[sq-11]]?.type=='Pawn'&&board[SQ120TO64[sq-11]]?.isWhite==side))
            {
                return true;
            } 
        }

        
        //check knight attacks
        for(let i=0;i<KNIGHT_DIR.length;i++)
        {
            const dir = KNIGHT_DIR[i];
            const temp_sq = sq + dir;
            if(SQ120TO64[temp_sq]==-1)continue;
            const piece = board[SQ120TO64[temp_sq]]
            if(piece!=''&&piece.type=='Knight'&&piece.isWhite==side)
            {
                return true;
            }
        }

        //check bishop and queen attacks(diagonal)
        for(let i=0;i<BISHOP_DIR.length;i++)
        {
            const dir = BISHOP_DIR[i];
            let pos120 = sq+dir;
            let temp_sq =SQ120TO64[pos120];
            if(temp_sq==-1)continue;
            let piece = board[temp_sq];
            
            while(temp_sq!=-1)
            {
                if(piece!='')
                {
                    if((piece.type=='Bishop'||piece.type=='Queen')&&piece.isWhite==side)
                    {
                        return true;
                    }
                    break;
                }
                pos120 +=dir;
                temp_sq = SQ120TO64[pos120];
                piece = board[temp_sq];
            }
        }
        for(let i=0;i<ROCK_DIR.length;i++)
        {
            const dir = ROCK_DIR[i];
            let pos120 = sq+dir;
            let temp_sq =SQ120TO64[pos120];
            if(temp_sq==-1)continue;
            let piece = board[temp_sq];
            while(temp_sq!=-1)
            {
                if(piece!='')
                {
                    if((piece.type=='Rook'||piece.type=='Queen')&&piece.isWhite==side)
                    {
                        return true;
                    }
                    
                    break;
                }
                pos120 +=dir;
                temp_sq = SQ120TO64[pos120];
                piece = board[temp_sq];
            }
        }
        
        for(let i=0;i<KING_DIR.length;i++)
        {
            const dir = KING_DIR[i];
            const temp_sq = SQ120TO64[dir+sq];
            if(temp_sq==-1)continue;
            const piece = board[temp_sq]
            if(piece!=''&&piece.type=='King'&&piece.isWhite==side)
            {
                return true;
            }

        }
        return false;
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