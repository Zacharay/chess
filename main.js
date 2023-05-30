import { Bishop, King, Knight, Pawn, Queen ,Rock} from "./pieces.js";
import { KING_DIR,KNIGHT_DIR,BISHOP_DIR,ROCK_DIR } from "./helpers.js";
import { SQ120TO64,SQ64TO120 } from "./helpers.js";
class Board{
    #board = Array(64).fill('');
    #attackedByWhite=[];
    #attackedByBlack=[];
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
    generateAllMoves(side)
    {
        

        console.log(this.#attackedByBlack,this.#attackedByWhite);
        let moves=[];
        this.#board.forEach(piece=>{
            if(piece.isWhite==side)
            {
                const pieceMoves = piece.generateMoves(this.#board);
                if(pieceMoves.length==0)return;

              
                moves.push(...pieceMoves);
            }
        })
       return moves;
    }
    generateAttackedSquares(side)
    {   
            let attacks=[]

            this.#board.forEach(piece=>{
                if(piece!=''&&piece.isWhite!=side)
                {
                    let pieceMoves=[];
                    let attackSquares=[];
                    if(piece.type=='Pawn')
                    {
                        pieceMoves = piece.generateMoves(this.#board).map(obj=>obj.to);
                        attackSquares = piece.generateAttackMoves(this.#board).map(obj=>obj.to);

                    }
                    else{
                        pieceMoves = piece.generateMoves(this.#board).map(obj=>obj.to);
                    }
                    attacks.push(pieceMoves)
                    
                }
            })

        if(side)
        {
            
        }
    
            
        
    }
    _isSquareAttacked(sq,side)
    {
        sq = SQ64TO120[sq];
        //white side Pawns
        /*if(side)
        {
            console.log(sq+9)
            console.log(SQ120TO64)
            console.log(SQ120TO64[sq+9])
            console.log(this.#board[SQ120TO64[sq+9]]);
            if(
                (this.#board[SQ120TO64[sq+9]]?.type=='Pawn'&&this.#board[SQ120TO64[sq+9]]?.isWhite==side)||
                (this.#board[SQ120TO64[sq+11]]?.type=='Pawn'&&this.#board[SQ120TO64[sq+11]]?.isWhite==side))
            {
                console.log(this.#board);
                return true;
            }
        }
        //Black side pawns
        else{
            if(
            (this.#board[SQ120TO64[sq+9]]?.type=='Pawn'&&this.#board[SQ120TO64[sq+9]]?.isWhite==side)||
            (this.#board[SQ120TO64[sq-11]]?.type=='Pawn'&&this.#board[SQ120TO64[sq-11]]?.isWhite==side))
            {
                return true;
            } 
        }*/


        //check knight attacks
        for(let i=0;i<KNIGHT_DIR.length;i++)
        {
            const dir = KNIGHT_DIR[i];
            const temp_sq = sq + dir;
            if(SQ120TO64[temp_sq]==-1)return;
            const piece = this.#board[SQ120TO64[temp_sq]]
            if(piece!=''&&piece.type=='Knight'&&piece.isWhite==side)
            {
                console.log("test");
                return true;
            }
        }
        //check bishop and queen attacks(diagonal)
        for(let i=0;i<BISHOP_DIR.length;i++)
        BISHOP_DIR.forEach((dir)=>{
            let pos120 = sq+dir;
            let temp_sq =SQ120TO64[pos120];
            if(temp_sq==-1)return;
            let piece = this.#board[temp_sq];
            while(temp_sq!=-1)
            {
                if(piece!='')
                {
                    if(piece.type=='Bishop'||piece.type=='Queen'&&piece.isWhite==side)
                    {
                        return true;
                    }
                    break;
                }
                pos120 +=dir;
                temp_sq = SQ120TO64[pos120];
            }
        })
        
        //check bishop and queen attacks(diagonal)
        ROCK_DIR.forEach((dir)=>{
            let pos120 = sq+dir;
            let temp_sq =SQ120TO64[pos120];
            if(temp_sq==-1)return;
            let piece = this.#board[temp_sq];
            while(temp_sq!=-1)
            {
                if(piece!='')
                {
                    if(piece.type=='Rook'||piece.type=='Queen'&&piece.isWhite==side)
                    {
                        return true;
                    }
                    break;
                }
                pos120 +=dir;
                temp_sq = SQ120TO64[pos120];
            }
        })
        KING_DIR.forEach(dir=>{
            const temp_sq = SQ120TO64[dir+sq];
            if(temp_sq==-1)return;
            const piece = this.#board[temp_sq]
            if(piece!=''&&piece.type=='King'&&piece.isWhite==side)
            {
                return true;
            }

        })
        return false;
    }
    _printAttackedSquares()
    {
        for(let i=0;i<8;i++)
        {
            let str = '';
            for(let j=0;j<8;j++)
            {
                const sq = j + i*8;
                
                const result = this._isSquareAttacked(sq,1);
                console.log(result);
                str=`${str} ${result?'1':'0'}`;
            }
            console.log(str);
        }
    }


}

class GameState{
    #turn=1;//1-white  0-black
    #selectedSquare;
    #boardObj
    #moves;
    constructor()
    {
        this.#boardObj= new Board();
       
       
        this.renderBoard();
        this.#moves = this.#boardObj.generateAllMoves(this.#turn);
       
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
        const tiles = document.querySelectorAll(".tile");
        const resetActiveTiles = (()=>{
            document.querySelector('.active-square')?.classList.remove("active-square");
            tiles.forEach((tile)=>{
                if(!tile.classList.contains('available-move'))return;
                    
                    tile.classList.remove('available-move');
                    tile.replaceWith(tile.cloneNode(true));
            })
        })

        const moves = this.#moves.filter((move)=>move.from==piecePos);
        if(moves.length==0)return;
        
        resetActiveTiles();
        tiles[piecePos].classList.add('active-square');
        this.#selectedSquare = piecePos;
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
        this.#boardObj.setNewPosition(this.#selectedSquare,to);
        this.#moves = this.#boardObj.generateAllMoves(this.#turn);
        this.renderBoard();
    }
    renderMoves(moves)
    {
        const tiles = document.querySelectorAll(".tile");
        moves.forEach((move)=>{
            tiles[move.to].classList.add('available-move');
        })
    }    
}
const app = new GameState();