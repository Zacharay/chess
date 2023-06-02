import Game from "./Game.js";
class GUI{
   
    #selectedSquare;
    #game
    constructor()
    {
        this.#game = new Game();
        this._renderBoard();
       
    }
    _renderBoard()
    {
        const board = this.#game.getBoard();
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
        const tiles = document.querySelectorAll(".tile");
        const resetActiveTiles = (()=>{
            document.querySelector('.active-square')?.classList.remove("active-square");
            tiles.forEach((tile)=>{
                if(!tile.classList.contains('available-move'))return;
                    
                    tile.classList.remove('available-move');
                    tile.replaceWith(tile.cloneNode(true));
            })
        })

        const moves = this.#game.getPieceMoves(piecePos);
        if(moves.length==0)return;
        
        resetActiveTiles();
        tiles[piecePos].classList.add('active-square');
        this.#selectedSquare = piecePos;
        this._renderMoves(moves);
        
        document.querySelectorAll(".available-move").forEach((sq)=>{
           const to= sq.getAttribute('data-pos')/1;
            sq.addEventListener('click',()=>{
                this._handleMove(to)
            })
        })
       

    }
    _handleMove(to)
    {
        const move = {from:this.#selectedSquare,to};
        this._soundHandler(move);
        this.#game.movePiece(move);
        this._isGameOver();
        this._renderBoard();
    }
    _soundHandler(move)
    {
        const board = this.#game.getBoard();

        if(board[move.to]!=''){
            const audio = new Audio('sounds/capture.mp3');
            audio.play();
        }
        else{
            const audio = new Audio('sounds/move-self.mp3');
            audio.play();
        }
    }
    _isGameOver()
    {
        const gameState = this.#game.getGameState();
        if(gameState=='active')return;
        else{
            const gameResult = document.querySelector(".game-result");
            gameResult.innerHTML = gameState;
        }
    }
    _renderMoves(moves)
    {
        const tiles = document.querySelectorAll(".tile");
        moves.forEach((move)=>{
            tiles[move.to].classList.add('available-move');
        })
    }    
    
}
const app = new GUI();