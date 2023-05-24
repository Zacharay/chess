import Knight from "./pieces.js";

class Board{
    #board = Array(64).fill('')
    #board120 = Array(120).fill(-1);
    #turn;
    #casstlePerm;
    constructor(fenNotation = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    {
        this._fenToBoard(fenNotation)
        const kn = new Knight();
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
                this.#board[curSq]=piece;
                curSq++;
            }
        }  
        this.#turn = parts[1];
        this.#casstlePerm= parts[2];

    }
    
    getBoard()
    {
        return this.#board;
    }
}

class Main{
    constructor()
    {
        const boardObj = new Board();
        const board = boardObj.getBoard();
        this._renderBoard(board);
    }
    _renderBoard(board)
    {
        const grid = document.querySelector(".grid");
        let html = '';
        for(let rank=0;rank<8;rank++)
        {
            for(let file=0;file<8;file++)
            {
                const boardIdx = rank*8+file
                const piece = board[boardIdx];
                const isEmpty = piece=='';
                const tileType = (file+rank)%2==0?'white':'black';
                html+=`<div class='tile-${tileType}'>
                ${!isEmpty?`<img src='piecesImg/${piece}.png' class='piece'/>`:''}
                </div>`
            }
        }
        grid.innerHTML = html;
        document.querySelectorAll(".piece").forEach((img)=>{
            img.ondragstart = ()=>{
                return false;
            }
        })
    }
}
const app = new Main();