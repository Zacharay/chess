import { SQ120TO64,SQ64TO120 } from "./helpers.js";
class Piece{
    moveList=[];
    pos;
    isWhite;
    symbol;
    constructor(white,pos)
    {
        this.isWhite =white;
        this.symbol = this.isWhite?'w':'b';
        this.pos = pos;
    }
}
export class Knight extends Piece{

    #offsets = [-21,-19,-8,12,21,19,-12,8]
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='N';
        
    }
    generateMoves(board)
    {
        const pos120 = SQ64TO120[this.pos];
        this.moveList=[];
        this.#offsets.forEach((offset)=>{
            const newPos = pos120+offset;
            if(SQ120TO64[newPos]==-1)return;

            const newPos64 = SQ120TO64[newPos];
            if(board[newPos64]=='') {
                this.moveList.push(newPos64);
            }
            else if(board[newPos64].isWhite!=this.isWhite)
            {
                this.moveList.push(newPos64);
            }

        })
        return this.moveList;
    }
}
export class Rock extends Piece{

    #offsets = [10,-10,1,-1];
    constructor(white,pos) {
        super(white,pos);
        this.symbol+='R';
    }
    generateMoves(board)
    {
        this.moveList=[];
        this.#offsets.forEach(offset=>{
            let newPos120 = SQ64TO120[this.pos] + offset;
            while(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
            {
                this.moveList.push(SQ120TO64[newPos120]);

                //break loop after finding first opponent piece 
                if(board[SQ120TO64[newPos120]]!='')break;

                newPos120+=offset;
            }
        })
        return this.moveList;
    }
}
export class Bishop extends Piece{

    #offsets =[11,-11,9,-9];
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='B';
    }
    generateMoves(board)
    {
        this.moveList=[];
        this.#offsets.forEach(offset=>{
            let newPos120 = SQ64TO120[this.pos] + offset;
            while(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
            {
                this.moveList.push(SQ120TO64[newPos120]);
                
                //break loop after finding first opponent piece 
                if(board[SQ120TO64[newPos120]]!='')break;

                newPos120+=offset;
            }
        })
        return this.moveList;
    }
}
export  class Queen extends Piece{

    #offsets = [11,-11,9,-9,10,-10,1,-1]
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='Q';
    }
    generateMoves(board)
    {
        this.moveList=[];
        this.#offsets.forEach(offset=>{
            let newPos120 = SQ64TO120[this.pos] + offset;
            while(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
            {
                this.moveList.push(SQ120TO64[newPos120]);

                //break loop after finding first opponent piece 
                if(board[SQ120TO64[newPos120]]!='')break;

                newPos120+=offset;
            }
        })
        return this.moveList;
    }
}
export class King extends Piece{

    #offsets = [10,-10,11,-11,9,-9,1,-1];
    constructor(white,pos) {
        super(white,pos);
        this.symbol +='K';
    }
    generateMoves(board)
    {
        this.moveList=[];
        this.#offsets.forEach(offset=>{
            let newPos120 = SQ64TO120[this.pos] + offset;
            if(SQ120TO64[newPos120]!=-1&&board[SQ120TO64[newPos120]].isWhite!=this.isWhite)
            {
                this.moveList.push(SQ120TO64[newPos120]);
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
    }
    generateMoves(board)
    {
        this.moveList=[];
        const pos120 = SQ64TO120[this.pos];
        const color = this.isWhite?1:-1;

        const oneSquareMove = SQ120TO64[pos120+this.#baseMove*color];
        
        if(oneSquareMove!=-1&&board[oneSquareMove]=='')
        {
            this.moveList.push(oneSquareMove);

            const twoSquareMove  = SQ120TO64[pos120+(this.#baseMove*2)*color];
            if(this.isOnStart(pos120)&&board[twoSquareMove]=='')
            {
                this.moveList.push(twoSquareMove);
            }
        }
        
        
        const leftDiagonalMove= SQ120TO64[pos120+(this.#baseMove-1)*color];
        if(leftDiagonalMove!=-1&&board[leftDiagonalMove]!=''&&board[leftDiagonalMove].isWhite!=this.isWhite)
        {
            this.moveList.push(leftDiagonalMove);
        }
        const rightDiagonalMove = SQ120TO64[pos120+(this.#baseMove+1)*color];
        if(rightDiagonalMove!=-1&&board[rightDiagonalMove]!=''&&board[rightDiagonalMove].isWhite!=this.isWhite)
        {
            this.moveList.push(rightDiagonalMove);
        }
        return this.moveList;
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


