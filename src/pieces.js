import { SQ120TO64,SQ64TO120,KING_DIR,KNIGHT_DIR,ROCK_DIR,BISHOP_DIR,QUEEN_DIR } from "./helpers.js";
class Piece{
    moveList=[];
    pos;
    isWhite;
    symbol;
    type;
    #isSlidingPiece
    #offsets;
    isOnStart=true;
    constructor(isWhite,pos,isSlidingPiece,offsets)
    {
        this.isWhite =isWhite;
        this.symbol = this.isWhite?'w':'b';
        this.pos = pos;
        this.#isSlidingPiece = isSlidingPiece;
        this.#offsets = offsets;
    }
    movePiece(pos)
    {
        this.pos = pos; 
    }
    getMoveType(move,board)
    {
        if(move.type)return move;

        const {to} = move;
        let type;
        if(board[to]=='')
        {
            type = 'normal'
        }
        else if(board[to]!='')
        {
            type='capture';
        }
        return {type,...move};
    }
    generateMoves(board)
    {
        this.moveList=[];
        if(this.#isSlidingPiece)
        {
            this.#offsets.forEach(offset=>{
                let newPos120 = SQ64TO120[this.pos] + offset;
                while(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
                {
                    const move = {from:this.pos,to:SQ120TO64[newPos120],piece:this.type}

                    this.moveList.push(move);

                    //break loop after finding first opponent piece 
                    if(board[SQ120TO64[newPos120]]!='')break;
                   
                    newPos120+=offset;
                }
            })
        }
        else{
            const pos120 = SQ64TO120[this.pos];
            this.#offsets.forEach((offset)=>{
                const newPos = pos120+offset;
                const newPos64 = SQ120TO64[newPos];
                if(SQ120TO64[newPos]==-1||board[newPos64].isWhite==this.isWhite)return;

                const move = {from:this.pos,to:newPos64,piece:this.type}
                
                this.moveList.push(move);
            })
        }
        return this.moveList.map(move=>this.getMoveType(move,board));;
    }
    
}
export class Knight extends Piece{

    constructor(white,pos) {
        super(white,pos,false,KNIGHT_DIR);
        this.symbol +='N';
        this.type = 'Knight'
    }
}
export class Rock extends Piece{

    constructor(white,pos) {
        super(white,pos,true,ROCK_DIR);
        this.symbol+='R';
        this.type = 'Rook'
    }
}
export class Bishop extends Piece{
    constructor(white,pos) {
        super(white,pos,true,BISHOP_DIR);
        this.symbol +='B';
        this.type = 'Bishop'
    }
    
}
export  class Queen extends Piece{
    constructor(white,pos) {
        super(white,pos,true,QUEEN_DIR);
        this.symbol +='Q';
        this.type = 'Queen'
    }
}
export class King extends Piece{
    constructor(white,pos) {
        super(white,pos,false,KING_DIR);
        this.symbol +='K';
        this.type = 'King'
    }
    generateMoves(board,isSquareAttacked)
    {
        const checkCastlingMoves = ()=>{
            const isInCheck = isSquareAttacked(this.pos,!this.isWhite,board)
            if(isInCheck||!this.isOnStart)return;

            let castlingMoves=[];

            const isQueenSideEmpty = board[this.pos-1]==''&&board[this.pos-2]==''&&board[this.pos-3]=='';
            const hasLeftRockMoved = board[this.pos-4].type=='Rock'&&board[this.pos-4].isOnStart == true;
            const leftSquaresAttacked = 
            isSquareAttacked(this.pos-1,!this.isWhite,board)|| 
            isSquareAttacked(this.pos-2,!this.isWhite,board)|| 
            isSquareAttacked(this.pos-3,!this.isWhite,board);
            const canCastleQueenside = isQueenSideEmpty&&!hasLeftRockMoved&&!leftSquaresAttacked

            if(canCastleQueenside)
            {
                const castleMove = {from:this.pos,to:this.pos-2,type:'castling',castlingSide:'Queen'}
                castlingMoves.push(castleMove);
            }
            const isKingSideEmpty = board[this.pos+1]==''&&board[this.pos+2]=='';
            const hasRightRockMoved = board[this.pos+3].type=='Rock'&&board[this.pos+3].isOnStart == true;
            const rightSquaresAttacked = isSquareAttacked(this.pos+1,!this.isWhite,board)|| isSquareAttacked(this.pos+2,!this.isWhite,board);
            const canCastleKingside = isKingSideEmpty&&!hasRightRockMoved&&!rightSquaresAttacked
            if(canCastleKingside)
            {
                const castleMove = {from:this.pos,to:this.pos+2,type:'castling',castlingSide:'King'}
                castlingMoves.push(castleMove);
            }
            return castlingMoves;
        }
        const castlingMoves = checkCastlingMoves();
        const normalMoves = super.generateMoves(board);
        if(!castlingMoves)return normalMoves;

        this.moveList = [...castlingMoves,...normalMoves];
        return this.moveList;
    }
}
export class Pawn extends Piece{
    possibleEnPassant=[];
    #baseMove = -10;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='P';
        this.type = 'Pawn'
    }
    getMoveType(move,board)
    {
        if(move.type)return {...move,piece:'Pawn'};

        const {from,to} = move;
        let type;
        if(this._isPromotionMove(to))
        {
            type = 'promotion';
        }
        else if(board[to]=='')
        {
            type = 'normal'
        }
        else if(board[to]!='')
        {
            type='capture';
        }
        return {from,to,type,piece:'Pawn'};
    }
    _isPromotionMove(to)
    {
        if((to <8&&this.isWhite)||(!this.isWhite)&&to<=63&&to>=56)return true;
           
        return false;
    }
    generateMoves(board)
    {
       
        this.moveList= [...this.possibleEnPassant]
        this.possibleEnPassant = [];
        const pos120 = SQ64TO120[this.pos];
        const color = this.isWhite?1:-1;

        const oneSquareMove = SQ120TO64[pos120+this.#baseMove*color];
        
        if(oneSquareMove!=-1&&board[oneSquareMove]=='')
        {
            const move = {from:this.pos,to:oneSquareMove}
            this.moveList.push(move);

            const twoSquareMove  = SQ120TO64[pos120+(this.#baseMove*2)*color];
            if(this.isOnStart&&board[twoSquareMove]=='')
            {
                const move = {from:this.pos,to:twoSquareMove,type:'twoSquarePawnMove'}
                this.moveList.push(move);
            }
        }

        const leftDiagonalMove= SQ120TO64[pos120+(this.#baseMove-1)*color];
        if(leftDiagonalMove!=-1&&board[leftDiagonalMove]!=''&&board[leftDiagonalMove].isWhite!=this.isWhite)
        {
            const move = {from:this.pos,to:leftDiagonalMove}
            this.moveList.push(move);
        }
        const rightDiagonalMove = SQ120TO64[pos120+(this.#baseMove+1)*color];
        if(rightDiagonalMove!=-1&&board[rightDiagonalMove]!=''&&board[rightDiagonalMove].isWhite!=this.isWhite)
        {
            const move = {from:this.pos,to:rightDiagonalMove}
            this.moveList.push(move);
        }
        return this.moveList.map(move=>this.getMoveType(move,board));
    }

}

