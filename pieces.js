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

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'N':'n';
    }
    generateMoves(board)
    {

    }
}
export class Rock extends Piece{

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'R':'r';
    }
    generateMoves(board)
    {

    }
}
export class Bishop extends Piece{

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'B':'b';
    }
    generateMoves(board)
    {

    }
}
export  class Queen extends Piece{

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'Q':'q';
    }
    generateMoves(board)
    {

    }
}
export class King extends Piece{

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'K':'k';
    }
    generateMoves(board)
    {

    }
}
export class Pawn extends Piece{

    constructor(white,pos) {
        super(white,pos);
        symbol = this.isWhite?'P':'p';
    }
    generateMoves(board)
    {

    }
}


