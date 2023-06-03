import { KING_DIR,KNIGHT_DIR,BISHOP_DIR,ROCK_DIR } from "./helpers.js";
import { SQ120TO64,SQ64TO120 } from "./helpers.js";
export default class MoveGenerator{
    #boardObj;
    constructor(board){
        this.#boardObj = board;
    }
    getLegalMoves(side)
    {
        const legalMoves = [];
        const board = this.#boardObj.getBoard();
        const pseudoLegalMoves = this._generatePseudoLegalMoves(side,board);
        pseudoLegalMoves.forEach((moveToCheck)=>{
            if(moveToCheck.type=='castling'){
                legalMoves.push(moveToCheck);
                return;
            }
            //make move
            const prevVal = this.#boardObj.makeMove(moveToCheck,false);

            const newBoard = this.#boardObj.getBoard();
            const kingPos = this.#boardObj.getKingPos(side);
            //check if legal
            if(!this.isSquareAttacked(kingPos,!side,newBoard))
            {
                legalMoves.push(moveToCheck);
            }
            //unmake move
            this.#boardObj.unmakeMove(moveToCheck,prevVal);
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
}