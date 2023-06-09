export default class GUI{
   
    #selectedSquare;
    #game
    #aiSide;
    #playerSide;
    constructor(game)
    {
       
        this.#game =game;
        this.#aiSide = this.#game.aiSide;
        this.#playerSide = this.#game.playerSide;
        const gameResultModal = document.querySelector(".result-modal");
        gameResultModal.classList.add('hidden')
        this.renderBoard();
       
    }
    renderBoard()
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
                const selectPromotion = rank==0?`<div class="select-promotion hidden">
                <button class='btn-promotion' data-type='Queen'></button>
                <button class='btn-promotion' data-type='Rock'></button>
                <button class='btn-promotion' data-type='Bishop'></button>
                <button class='btn-promotion' data-type='Knight'></button>
            </div>`:'';
                if(board[boardIdx].symbol)
                {
                    piece = board[boardIdx];
                    isEmpty = false;
                }
                else{
                    isEmpty =true;
                }
                const tileType = (file+rank)%2==0?'white':'black';
                html+=`<div class='tile tile-${tileType}' data-pos='${boardIdx}'>
                ${selectPromotion}
                ${!isEmpty?`<img src='piecesImg/${piece.symbol}.png' data-color=${piece.isWhite} class='piece'/>`:''}
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
            const pieceColor = piece.getAttribute('data-color');
            if(pieceColor==this.#playerSide)
            {
                const piecePos = piece.closest(".tile").getAttribute('data-pos');
                piece.addEventListener('click',()=>{
                    this.selectPiece(piecePos);
                })
            }    
        })
        const promotionBtns = document.querySelectorAll(".btn-promotion");
        promotionBtns.forEach((btn)=>{
            const pieceType = btn.getAttribute("data-type");
            btn.addEventListener('click',()=>{
                this.promoteTo(pieceType);
            })
        })
    }
    showPromotionModal(tileIdx)
    {
        const tile =document.querySelectorAll('.tile')[tileIdx];
        tile.firstChild.classList.remove('hidden');
    }
    promoteTo(piece)
    {
        console.log(piece);
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

        const moves = this.#game.getPieceMoves(piecePos,this.#playerSide);
        if(moves.length==0)return;
        
        resetActiveTiles();
        tiles[piecePos].classList.add('active-square');
        this.#selectedSquare = piecePos;
        this._renderMoves(moves);
        
        document.querySelectorAll(".available-move").forEach((sq)=>{
           const to= sq.getAttribute('data-pos')/1;
            sq.addEventListener('click',()=>{
                this._handleMove(to,moves)
            })
        })
       

    }
    _handleMove(to,moves)
    {
        
        const move = moves.find(move=>move.from ==this.#selectedSquare&&move.to == to);
        this.#game.playOneTurn(move);
    }
    soundHandler(moveType)
    {
        if(moveType=='capture'){
            const audio = new Audio('sounds/captureMove.mp3');
            audio.play();
        }
        else if(moveType =='normal'||moveType=='twoSquarePawnMove'){
            const audio = new Audio('sounds/normalMove.mp3');
            audio.play();
        }
        else if(moveType =='castling'){
            const audio = new Audio('sounds/castleMove.mp3');
            audio.play();
        }
        else if(moveType=='promotion')
        {
            const audio = new Audio('sounds/promote.mp3');
            audio.play();
        }
    }
    gameOverState(gameState)
    {
        const gameResultModal = document.querySelector(".result-modal");
        const whiteModalImg = document.querySelector("#modal--white-side");
        const blackModalImg = document.querySelector("#modal--black-side");
        const resultH3 = document.querySelector(".result-h3");

        resultH3.innerHTML = "by checkmate";
        if(gameState=='black')
        {
            blackModalImg.classList.add("winner-img");
            whiteModalImg.classList.add("loser-img");
        }
        else if(gameState =='white')
        {
            whiteModalImg.classList.add("winner-img");
            blackModalImg.classList.add("loser-img");
        }
        else{
            resultH3.innerHTML = "by draw";
            whiteModalImg.classList.add("draw-img");
            blackModalImg.classList.add("draw-img");
        }

        gameResultModal.classList.remove('hidden');

    }
    _renderMoves(moves)
    {
        const tiles = document.querySelectorAll(".tile");
        moves.forEach((move)=>{
            tiles[move.to].classList.add('available-move');
        })
    }    
    
}

