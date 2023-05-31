import { SQ120TO64,SQ64TO120,KING_DIR,KNIGHT_DIR,ROCK_DIR,BISHOP_DIR,QUEEN_DIR } from "./helpers.js";
class Piece{
    moveList=[];
    pos;
    isWhite;
    symbol;
    type;
    constructor(white,pos)
    {
        this.isWhite =white;
        this.symbol = this.isWhite?'w':'b';
        this.pos = pos;
    }
}
export class Knight extends Piece{

    #offsets = KNIGHT_DIR;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='N';
        this.type = 'Knight'
    }
    generateMoves(board)
    {
        const pos120 = SQ64TO120[this.pos];
        this.moveList=[];
        this.#offsets.forEach((offset)=>{
            const newPos = pos120+offset;
            const newPos64 = SQ120TO64[newPos];
            if(SQ120TO64[newPos]==-1||board[newPos64].isWhite==this.isWhite)return;

            const move = {from:this.pos,to:newPos64}
        
            this.moveList.push(move);
           
        })
        return this.moveList;
    }
}
export class Rock extends Piece{

    #offsets = ROCK_DIR;
    constructor(white,pos) {
        super(white,pos);
        this.symbol+='R';
        this.type = 'Rook'
    }
    generateMoves(board)
    {
        this.moveList=[];
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
        return this.moveList;
    }
}
export class Bishop extends Piece{

    #offsets =BISHOP_DIR;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='B';
        this.type = 'Bishop'
    }
    generateMoves(board)
    {
        this.moveList=[];
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
        return this.moveList;
    }
}
export  class Queen extends Piece{

    #offsets = QUEEN_DIR;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='Q';
        this.type = 'Queen'
    }
    generateMoves(board)
    {
        this.moveList=[];
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
        return this.moveList;
    }
}
export class King extends Piece{

    #offsets = KING_DIR;
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='K';
        this.type = 'King'
    }
    generateMoves(board)
    {
        this.moveList=[];
        this.#offsets.forEach(offset=>{
            let newPos120 = SQ64TO120[this.pos] + offset;
            if(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
            {
                const move = {from:this.pos,to:SQ120TO64[newPos120]}

                this.moveList.push(move);
            }
        })
        return this.moveList;
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
            this.moveList.push({from:this.pos,to:oneSquareMove});

            const twoSquareMove  = SQ120TO64[pos120+(this.#baseMove*2)*color];
            if(this.isOnStart(pos120)&&board[twoSquareMove]=='')
            {
                this.moveList.push({from:this.pos,to:twoSquareMove});
            }
        }

        const leftDiagonalMove= SQ120TO64[pos120+(this.#baseMove-1)*color];
        if(leftDiagonalMove!=-1&&board[leftDiagonalMove]!=''&&board[leftDiagonalMove].isWhite!=this.isWhite)
        {
            this.moveList.push({from:this.pos,to:leftDiagonalMove});
        }
        const rightDiagonalMove = SQ120TO64[pos120+(this.#baseMove+1)*color];
        if(rightDiagonalMove!=-1&&board[rightDiagonalMove]!=''&&board[rightDiagonalMove].isWhite!=this.isWhite)
        {
            this.moveList.push({from:this.pos,to:rightDiagonalMove});
        }

        return this.moveList;
    }

    generateAttackMoves(board)
    {
        const pos120 = SQ64TO120[this.pos];
        const color = this.isWhite?1:-1;
        const attackMoves =[];
        const leftDiagonalMove= SQ120TO64[pos120+(this.#baseMove-1)*color];
        if(leftDiagonalMove!=-1)
        {
            attackMoves.push({from:this.pos,to:leftDiagonalMove});
        }
        const rightDiagonalMove = SQ120TO64[pos120+(this.#baseMove+1)*color];
        if(rightDiagonalMove!=-1)
        {
            attackMoves.push({from:this.pos,to:rightDiagonalMove});
        }
        
        return attackMoves;
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

