import { SQ120TO64,SQ64TO120 } from "./helpers.js";
class Piece{
    moveList=[];
    pos;
    isWhite;
    symbol;
    constructor(white,pos)
    {
        this.isWhite =white;
        this.pos = pos;
    }
}
export class Knight extends Piece{

    #offsets = [-21,-19,-8,12,21,19,-12,8]
    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'N':'n';
        
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

    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'R':'r';
    }
    generateMoves(board)
    {

    }
}
export class Bishop extends Piece{

    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'B':'b';
    }
    generateMoves(board)
    {

    }
}
export  class Queen extends Piece{

    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'Q':'q';
    }
    generateMoves(board)
    {

    }
}
export class King extends Piece{

    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'K':'k';
    }
    generateMoves(board)
    {

    }
}
export class Pawn extends Piece{

    constructor(white,pos) {
        super(white,pos);
        this.symbol = this.isWhite?'P':'p';
    }
    generateMoves(board)
    {

    }
}


