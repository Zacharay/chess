import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";
import { SQ120TO64,SQ64TO120 } from "./helpers.js";
class Board{
    #board = Array(64).fill('')
    #board120 = Array(120).fill(-1);
    #castlePerm;
    #turn;
    constructor(fenNotation = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    {
        this._fenToBoard(fenNotation)
        const kn = new Knight();
        console.log(SQ120TO64,SQ64TO120)
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
        this.#turn = parts[1];
        this.#castlePerm= parts[2];

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
    renderBoard()
    {
        const grid = document.querySelector(".grid");
        let html = '';
        for(let rank=0;rank<8;rank++)
        {
            for(let file=0;file<8;file++)
            {
                const boardIdx = rank*8+file
                let isEmpty;
                let piece;
                if(this.#board[boardIdx].symbol)
                {
                    piece = this.#board[boardIdx].symbol;
                    isEmpty = false;
                }
                else{
                    isEmpty =true;
                }
                const tileType = (file+rank)%2==0?'white':'black';
                html+=`<div class='tile tile-${tileType}'>
                ${!isEmpty?`<img src='piecesImg/${piece}.png' class='piece' data-pos='${boardIdx}'/>`:''}
                </div>`
            }
        }
        grid.innerHTML = html;
        
    }
    getBoard()
    {
        return this.#board;
    }
}

class GameState{
    #board
    #tiles;
    #turn=1;//1-white  0-black
    constructor()
    {
        const boardObj = new Board();
        this.#board = boardObj.getBoard();
        
        boardObj.renderBoard();
        this.#tiles = document.querySelectorAll(".tile");
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach((piece,idx)=>{
            piece.ondragstart = ()=>{
                return false;
            }
            const piecePos = piece.getAttribute('data-pos');
            
            piece.addEventListener('click',()=>{
                this.handleMove(piecePos);
            })
        })
    }
    handleMove(piecePos)
    {
        if(this.#board[piecePos].isWhite!=this.#turn)return;

        const moves = this.#board[piecePos].generateMoves(this.#board);
        this.#tiles[piecePos].classList.add('active-square');
        this.renderMoves(moves);

        this.#turn=!this.#turn;


    }
    renderMoves(moves)
    {
        const tiles = document.querySelectorAll(".tile");

        
        moves.forEach((move)=>{
            tiles[move].classList.add('available-move');
        })
    }    
}
const app = new GameState();