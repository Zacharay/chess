import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";
import { SQ120TO64, SQ64TO120 } from "./helpers.js";
import { getHashKey } from "./AI/OpeningBook/Zobrist.js";
export default class Board{
    #board = Array(64).fill('');
    side=1;
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
    makeMove(move)
    {   
        this.#board[move.from].numOfMovesMade++;
        this.#board[move.from].movePiece(move.to);

        const pieceOnCapturedSquare =this.#board[move.to];
        
        this.#board[move.to]=this.#board[move.from];
        this.#board[move.from]='';

        return  pieceOnCapturedSquare;
    }
    handleMove(move,trueMove=true)
    {   
        
        if(move.type=='castling')
        {
            const kingPos = move.from;
            if(move.castlingSide=='King')this.makeMove({from:kingPos+3,to:kingPos+1});
            else this.makeMove({from:kingPos-4,to:kingPos-1});
        }
        // else if(move.type=='twoSquarePawnMove')
        // {
        //     this._addPossibleEnPassants(move);
        // }
        // else if(move?.enPassantPiece)
        // {
        //     this.#board[move.enPassantPiece] = '';
        // }
        else if(move.type=='promotion')
        {
            this.#board[move.from] = '';
            const piece = new Queen(this.side,move.from);
            this.#board[move.from] = piece;
        }
        const prevVal = this.makeMove(move,trueMove);
        this.changeSide();
        return prevVal;
    }
    setBoard(board)
    {
        const newBoard = board.slice();
        this.#board = newBoard;
    }
    unmakeMove(move,prevVal)
    {

        this.#board[move.to].numOfMovesMade--;

        if(move.type=='castling')
        {
            const kingPos = move.from;
        
            if(move.castlingSide=='King'){
                
                const from = kingPos+1;
                const to = kingPos+3;
                this.#board[to]= this.#board[from];
                this.#board[from].movePiece(to); 
                this.#board[to].numOfMovesMade--;
                this.#board[from]='';
            }
            else {
                const from  = kingPos-1;
                const to = kingPos-4;
                this.#board[to]= this.#board[from];
                this.#board[from].movePiece(to); 
                this.#board[to].numOfMovesMade--;
                this.#board[from]='';
            };
        }
        // else if(move?.enPassantPiece)
        // {
           
        //     this.#board[move.enPassantPiece] = new Pawn(!this.side,move.enPassantPiece,false);
        // }
        else if(move.type=='promotion')
        {
            this.#board[move.to] = '';
            const color = this.side ==0?1:0;
            const piece = new Pawn(color,move.to);
            this.#board[move.to] = piece;
            
        }
        
        this.#board[move.to].movePiece(move.from); 

        this.#board[move.from]=this.#board[move.to];
        this.#board[move.to]=prevVal;
        this.changeSide();
    }
    killPiece(sq)
    {
        this.#board[sq]='';
    }
    _addPossibleEnPassants(move)
    {
        const board = this.getBoard();
        const leftNbrPos120 = SQ64TO120[move.to]-1;
        const rightNbrPos120 = SQ64TO120[move.to]+1;

        const leftNbrPos64 = SQ120TO64[leftNbrPos120];
        const rightNbrPos64 = SQ120TO64[rightNbrPos120];

        const color = board[move.from].isWhite?-1:1;
        if(leftNbrPos64!=-1&&board[leftNbrPos64]?.type=='Pawn'&&board[move.from].isWhite!=board[leftNbrPos64].isWhite)
        {
   
            const newMove = {from:leftNbrPos64,to:move.from+8*color,type:'capture',enPassantPiece:move.to}
            board[leftNbrPos64].possibleEnPassant.push(newMove);  
        }

        if(rightNbrPos64!=-1&&board[rightNbrPos64]?.type=='Pawn'&&board[move.from].isWhite!=board[rightNbrPos64].isWhite)
        {
           
            const newMove = {from:rightNbrPos64,to:move.from+8*color,type:'capture',enPassantPiece:move.to}
            board[rightNbrPos64].possibleEnPassant.push(newMove);    
        }

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
    changeSide()
    {
        this.side = this.side==1?0:1;
    }
    printBoard()
    {
        for(let i=0;i<8;i++)
        {
            let temp = [];
            for(let j = 0;j<8;j++)
            {
                const sq = i*8+j;
                const piece = this.#board[sq];
                if(piece=='')temp.push('--');
                else temp.push(this.#board[sq].symbol);
            }
            console.log(temp)
        }
    }
    getBoardHashKey()
    {
        return getHashKey(this,'KQkq','-');
    }
}