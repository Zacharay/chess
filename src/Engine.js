import MoveGenerator from "./MoveGenerator.js";

export default class Engine{
    #openingBook;
    #boardObj
    constructor(boardObj)
    {
        this.#boardObj = boardObj;
        this.#openingBook = null;

        this.getOpeningBook()
        .then(openingBook => {
            this.#openingBook = openingBook;
        })
        .catch(error => {
            console.error('Error reading JSON file:', error);
        });
        
    }
    findNextMove(legalMoves)
    {
        const bookMove = this._getBookMove();

        if(bookMove)
        {
            return bookMove;
        }
        else 
        {
            console.log(this._searchPositions(3));
            const move = legalMoves[Math.floor(Math.random()*legalMoves.length)];
        
            return move;
        }
       
    }
    async getOpeningBook()
    {
        return fetch('src/OpeningBook/Book.json')
        .then(response => response.json())
        .then(data => {
            const myMap = new Map(Object.entries(data));
            return myMap;
        })
        .catch(error => {
            console.error('Error reading JSON file:', error);
        });
    }
    _getBookMove()
    {
        const hashKey = this.#boardObj.getBoardHashKey().toString();
        
        const openingBookMoves = this.#openingBook.get(hashKey);
        if(openingBookMoves){
            const randomNum = Math.floor(Math.random()*openingBookMoves.length);
            const bookMove = openingBookMoves[randomNum];
            console.log(bookMove)
            console.log('book');
            return bookMove;
        }
    }
    _searchPositions(maxDepth)
    {

        return this.negaMax(maxDepth);
    }
    negaMax(depth)
    {
        let bestScore = -Infinity;
        if(depth==0)
        {
            return 1;
        }
        const moveGen = new MoveGenerator(this.#boardObj);
        const moves = moveGen.getLegalMoves(this.#boardObj.side);
        console.log(moves)
        moves.forEach(move=>{
            
            console.log(move,this.#boardObj.side,depth,this);
            const prevVal = this.#boardObj.handleMove(move,false);
            this.#boardObj.printBoard();
            const moveScore = this.negaMax(depth-1);


            this.#boardObj.unmakeMove(move,prevVal);
            //console.log(this.#boardObj.getBoard());
            if(moveScore>bestScore)
            {
                bestScore = moveScore;
            }
        })
        return bestScore;

    }
}