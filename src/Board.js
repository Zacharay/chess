import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";

export default class Board{
    #board = Array(64).fill('');
    #kings=[];//0 black king 1 white king 
    constructor(fenNotation = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    {
        this._fenToBoard(fenNotation)
    }
    _fenToBoard(fenNotation)
    {
        const parts = fenNotation.split(" ");
        let curSq = 0;
        for(let i=0;i<parts[0].length;i++)
        {
            const piece = parts[0][i];
            if(piece=='/'||piece=='-'){
                continue;
            }
            else if(piece>='1'&&piece<='8')
            {
                curSq+=piece/1;
            }
            else{
                this.#board[curSq]=this._getPieceBySymbol(piece,curSq);
                curSq++;
            }
        }  


    }
    _getPieceBySymbol(symbol,pos)
    {
        let color = symbol==symbol.toLowerCase()?0:1;//1-white 0-black
        symbol= symbol.toLowerCase();
        if(symbol=='n')
        {
            return new Knight(color,pos)
        }
        else if(symbol=='r')
        {
            return new Rock(color,pos)
        }
        else if(symbol=='q')
        {
            return new Queen(color,pos)
        }
        else if(symbol=='b')
        {
            return new Bishop(color,pos)
        }
        else if(symbol=='p')
        {
            return new Pawn(color,pos)
        }
        else if(symbol=='k')
        {
            const king = new King(color,pos);
            this.#kings[color]=king;
            return king;

        }

    }
    makeMove(move,trueMove=true)
    {
        if(trueMove)this.#board[move.from].isOnStart = false;
         
        this.#board[move.from].movePiece(move.to);

        const pieceOnCapturedSquare =this.#board[move.to];
        
        this.#board[move.to]=this.#board[move.from];
        this.#board[move.from]='';
        return  pieceOnCapturedSquare;
    }
    unmakeMove(move,prevVal)
    {
        
        this.#board[move.to].movePiece(move.from); 

        this.#board[move.from]=this.#board[move.to];
        this.#board[move.to]=prevVal;
    }
    killPiece(sq)
    {
        this.#board[sq]='';
    }
    addNewPiece(pos,piece)
    {
        this.#board[pos]=piece;
    }
    getBoard()
    {
        return this.#board;
    }
    getKingPos(side)
    {
        return this.#kings[side].pos;
    }




}
