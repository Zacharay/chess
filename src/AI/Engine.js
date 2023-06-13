import MoveGenerator from "../MoveGenerator.js";
import EvaluateFromSide from "./Evaluate.js";
export default class Engine{
    #openingBook;
    #boardObj
    #test=0;
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
            const move = this._searchPositions(legalMoves,4)
            //const move = legalMoves[Math.floor(Math.random()*legalMoves.length)];
        
            return move;
        }
       
    }
    async getOpeningBook()
    {
        return fetch('src/AI/OpeningBook/Book.json')
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
    _searchPositions(moves,maxDepth)
    {
        let bestScore= -Infinity;
        let bestMove;
        moves.forEach(move=>{
            const prevVal = this.#boardObj.handleMove(move);
           
            const moveScore = -this.negaMax(maxDepth-1,-Infinity,Infinity);
            this.#boardObj.unmakeMove(move,prevVal);

            if(moveScore>bestScore)
            {
                bestScore = moveScore;
                bestMove = move;
            }
        })
        console.log(this.#test);
        return bestMove;
    }
    negaMax(depth,alpha,beta)
    {
        if(depth==0)
        {
            this.#test++;
            return EvaluateFromSide(this.#boardObj);
        }
        
        const moveGen = new MoveGenerator(this.#boardObj);
        const moves = moveGen.getLegalMoves();
        for(let i=0;i<moves.length;i++)
        {
            const move = moves[i];
            //console.log(moves,move)
            const prevVal = this.#boardObj.handleMove(move);
           
            const moveScore = -this.negaMax(depth-1,-beta,-alpha);

            this.#boardObj.unmakeMove(move,prevVal);
            if(moveScore>=beta)
            {
                return beta;
            }
            if(moveScore>alpha)
            {
                alpha = moveScore;
            }
        }
        return alpha;
    }
    alphaBetaMax(alpha,beta,depthLeft)
    {
        if(depthLeft==0)
        {
            this.#test++;
            return EvaluateFromSide(this.#boardObj);
        }
        const moveGen = new MoveGenerator(this.#boardObj);
        const moves = moveGen.getLegalMoves();
        for(let i=0;i<moves.length;i++)
        {
            const move = moves[i];
            const prevVal = this.#boardObj.handleMove(move);
           
            const moveScore = this.alphaBetaMin(alpha,beta,depthLeft-1);


            this.#boardObj.unmakeMove(move,prevVal);
            
            if(moveScore>=beta)return beta;
            if (moveScore>alpha)alpha = moveScore;
        }
        return alpha;
    }
    alphaBetaMin(alpha,beta,depthLeft)
    {
        if(depthLeft==0)
        {
            this.#test++;
            return EvaluateFromSide(this.#boardObj);
        }
        const moveGen = new MoveGenerator(this.#boardObj);
        const moves = moveGen.getLegalMoves();
        for(let i=0;i<moves.length;i++)
        {
            const move = moves[i];
            //console.log(moves,move)
            const prevVal = this.#boardObj.handleMove(move);
           
            const moveScore = this.alphaBetaMax(alpha,beta,depthLeft-1);


            this.#boardObj.unmakeMove(move,prevVal);
            
            if(moveScore<=alpha)return alpha;
            if (moveScore<beta)beta = moveScore;
        }
        return beta;
    }
}