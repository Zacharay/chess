import Board from '../Board.js';
import {sqToFile,sqToRank,fileRankToSq,getAllRankFileSquares} from '../helpers.js';
import MoveGenerator from '../MoveGenerator.js';
import {getHashKey} from "./Zobrist.js"
fetch('src/OpeningBook/Games.txt')
  .then(response => response.text())
  .then(contents => {
    const lines = contents.split('\n');
    let arr = []
    for(let j=0;j<lines.length-10;j++)
    {
      // Process each line here
      const line = lines[j];
      const moves = line.split(' ');
      let testMoves = [];
      for(let i=0;i<15;i++)
      {
        testMoves.push(moves[i]);
      }
      
      arr.push(...pgnParser(testMoves));
    }
    arr = [...new Set(arr)]
    arr.sort();
    console.log(arr);
    
  })
  .catch(error => console.log(error));

function pgnParser(moves)
{
  const boardObj = new Board();
  const moveGen = new MoveGenerator(boardObj);
  let ans = []
  ans.push(getHashKey(boardObj.getBoard(),"KQkq",'-'));
  moves.forEach(moveFR=>{
    const legalMoves = moveGen.getLegalMoves();
    
    if(moveFR=='O-O'){
      const move = legalMoves.find((move)=>move.type=='castling'&&move.castlingSide=='King');
      ans.push(getHashKey(boardObj.getBoard(),"KQkq",'-'));
      boardObj.handleMove(move);
      return;
    }
    if(moveFR=='O-O-O'){
      const move = legalMoves.find((move)=>move.type=='castling'&&move.castlingSide=='Queen');
      boardObj.handleMove(move);
      ans.push(getHashKey(boardObj.getBoard(),"KQkq",'-'));
      return;
    }

    if(moveFR.includes('+'))moveFR = moveFR.slice(0,-1);

    let pieceToMove = 'Pawn';
    if(moveFR[0]=='N')pieceToMove= 'Knight';
    else if(moveFR[0]=='R')pieceToMove= 'Rook';
    else if(moveFR[0]=='B')pieceToMove= 'Bishop';
    else if(moveFR[0]=='Q')pieceToMove= 'Queen';
    else if(moveFR[0]=='K')pieceToMove = 'King';

    let i = pieceToMove=='Pawn'?0:1;
    let moveFrom = Array.from({ length: 64 }, (_, index) => index);
    
    for(i;i<moveFR.length-1;i++)
    {
        const moveTo = fileRankToSq(moveFR[i]+moveFR[i+1]);
        
        if(moveTo==-1&&moveFR[i]!='x')
        {
          moveFrom = getAllRankFileSquares(moveFR[i]);
        }
        if(moveTo!=-1)
        {
          const move = legalMoves.find((move)=>move.to==moveTo&&pieceToMove==move.piece&&moveFrom.includes(move.from));
          boardObj.handleMove(move);
          ans.push(getHashKey(boardObj.getBoard(),"KQkq",'-'));
          break;
         
        }
    }
   
   
  })
  return ans;
}