import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";
import { SQ120TO64,SQ64TO120 } from "./helpers.js";
class Board{
    #board = Array(64).fill('');
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
    getPieceByPos(pos)
    {
        return this.#board[pos];
    }
    getPieceMoves(piecePos)
    {
        return this.#board[piecePos].generateMoves(this.#board)
    }
    getBoard()
    {
        return this.#board;
    }
}

class GameState{
    #turn=1;//1-white  0-black
    #activePiece;
    #boardObj
    constructor()
    {
        this.#boardObj= new Board();
       
       
        this.renderBoard();
        
       
    }
    renderBoard()
    {

        const board = this.#boardObj.getBoard();
        const grid = document.querySelector(".grid");
        let html = '';
        for(let rank=0;rank<8;rank++)
        {
            for(let file=0;file<8;file++)
            {
                const boardIdx = rank*8+file
                let isEmpty;
                let piece;
                if(board[boardIdx].symbol)
                {
                    piece = board[boardIdx].symbol;
                    isEmpty = false;
                }
                else{
                    isEmpty =true;
                }
                const tileType = (file+rank)%2==0?'white':'black';
                html+=`<div class='tile tile-${tileType}' data-pos='${boardIdx}'>
                ${!isEmpty?`<img src='piecesImg/${piece}.png' class='piece'/>`:''}
                </div>`
            }
        }
        grid.innerHTML = html;
        this.addPiecesListeners();
    }
    addPiecesListeners()
    {
        const pieces = document.querySelectorAll('.piece');
        pieces.forEach((piece,idx)=>{
            piece.ondragstart = ()=>{
                return false;
            }
            const piecePos = piece.closest(".tile").getAttribute('data-pos');
            piece.addEventListener('click',()=>{
                this.selectPiece(piecePos);
            })
        })
    }
    selectPiece(piecePos)
    {
        console.log(this.#boardObj.getBoard())
        const tiles = document.querySelectorAll(".tile");
        const resetActiveTiles = (()=>{
            document.querySelector('.active-square')?.classList.remove("active-square");
            tiles.forEach((tile)=>{
                if(!tile.classList.contains('available-move'))return;
                    
                    tile.classList.remove('available-move');
                    tile.replaceWith(tile.cloneNode(true));
            })
        })

        const selectedPiece = this.#boardObj.getPieceByPos(piecePos);
        if(selectedPiece.isWhite!=this.#turn)return;

        resetActiveTiles();
        const moves = this.#boardObj.getPieceMoves(piecePos);
        tiles[piecePos].classList.add('active-square');
        this.#activePiece = selectedPiece;
        this.renderMoves(moves);
        
        document.querySelectorAll(".available-move").forEach((sq)=>{
           const to= sq.getAttribute('data-pos')/1;
            sq.addEventListener('click',()=>{
                this.movePiece(to)
            })
        })
       

    }
    movePiece(to)
    {
        this.#turn = !this.#turn;
        this.#boardObj.setNewPosition(this.#activePiece.pos,to);
        this.renderBoard();
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