import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";

export default class Board{
    #board = Array(64).fill('');
    #kingsPos = [4,60]//0 black king 1 white king 
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
            return new King(color,pos)
        }

    }
    setNewPosition(from,to)
    {
        if(this.#board[to]!=''){
            const audio = new Audio('sounds/capture.mp3');
            audio.play();
        }
        else{
            const audio = new Audio('sounds/move-self.mp3');
            audio.play();
        }
        this.#board[from].pos = to;

        this.#board[to]=this.#board[from];
        this.#board[from]='';
    }
    getBoard()
    {
        return this.#board;
    }
    getKingPos(side)
    {
        return this.#kingsPos[side];
    }




}
