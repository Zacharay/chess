import { SQ120TO64,SQ64TO120,KING_DIR,KNIGHT_DIR,ROCK_DIR,BISHOP_DIR,QUEEN_DIR } from "./helpers.js";
class Piece{
    moveList=[];
    pos;
    isWhite;
    symbol;
    type;
    #isSlidingPiece
    #offsets;
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
        const {from,to} = move;
        let type;
        if(board[to]=='')
        {
            type = 'normal'
        }
        else if(board[to]!='')
        {
            type='capture';
        }
        return {from,to,type};
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
                    const move = {from:this.pos,to:SQ120TO64[newPos120]}

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

                const move = {from:this.pos,to:newPos64}
                
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

    #isOnStart=true;
    constructor(white,pos) {
        super(white,pos,true,ROCK_DIR);
        this.symbol+='R';
        this.type = 'Rook'
    }
    movePiece(to)
    {
        this.#isOnStart = false;
        this.pos = to;
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
}
export class Pawn extends Piece{

    #baseMove = -10;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='P';
        this.type = 'Pawn'
    }
    generateMoves(board)
    {
        this.moveList=[];
        const pos120 = SQ64TO120[this.pos];
        const color = this.isWhite?1:-1;

        const oneSquareMove = SQ120TO64[pos120+this.#baseMove*color];
        
        if(oneSquareMove!=-1&&board[oneSquareMove]=='')
        {
            const move = {from:this.pos,to:oneSquareMove}
            this.moveList.push(move);

            const twoSquareMove  = SQ120TO64[pos120+(this.#baseMove*2)*color];
            if(this.isOnStart(pos120)&&board[twoSquareMove]=='')
            {
                const move = {from:this.pos,to:twoSquareMove}
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

    isOnStart(pos)
    {
        pos = Math.floor(pos/10);
        if((pos==3&&!this.isWhite)||(pos==8&&this.isWhite))
        {
            return true;
        }
        else return false;
    }
}

