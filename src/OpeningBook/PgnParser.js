import Board from '../Board.js';
import {sqToFile,sqToRank,fileRankToSq,getAllRankFileSquares} from '../helpers.js';
import MoveGenerator from '../MoveGenerator.js';
import {getHashKey} from "./Zobrist.js"
fetch('src/OpeningBook/Games.txt')
  .then(response => response.text())
  .then(contents => {
    const lines = contents.split('\n');
    const map = new Map();
    for(let j=0;j<lines.length-2;j++)
    {
      // Process each line here
      const line = lines[j];
      const moves = line.split(' ');
      let testMoves = [];
      for(let i=0;i<15;i++)
      {
        testMoves.push(moves[i]);
      }

      pgnParser(testMoves,map);
    }
    const plainObject = Object.fromEntries(map);
    const json = JSON.stringify(plainObject);
    console.log(json);    
  })
  .catch(error => console.log(error));

function pgnParser(moves,map)
{
  const boardObj = new Board();
  const moveGen = new MoveGenerator(boardObj);
  let currentHashKey = getHashKey(boardObj,"KQkq",'-');
  let currentMove;

  for(let i=0;i<moves.length-1;i++)
  {
    let moveFR = moves[i];
    const legalMoves = moveGen.getLegalMoves();

    if(moveFR.includes('+'))moveFR = moveFR.slice(0,-1);

    if(moveFR=='O-O'){
      currentMove = legalMoves.find((move)=>move.type=='castling'&&move.castlingSide=='King');
    }
    else if(moveFR=='O-O-O'){
      currentMove = legalMoves.find((move)=>move.type=='castling'&&move.castlingSide=='Queen');
    }
    else{
      let pieceToMove = 'Pawn';
      if(moveFR[0]=='N')pieceToMove= 'Knight';
      else if(moveFR[0]=='R')pieceToMove= 'Rook';
      else if(moveFR[0]=='B')pieceToMove= 'Bishop';
      else if(moveFR[0]=='Q')pieceToMove= 'Queen';
      else if(moveFR[0]=='K')pieceToMove = 'King';

      let j = pieceToMove=='Pawn'?0:1;
      let moveFrom = Array.from({ length: 64 }, (_, index) => index);
      
      for(j;j<moveFR.length-1;j++)
      {
          const moveTo = fileRankToSq(moveFR[j]+moveFR[j+1]);
          
          if(moveTo==-1&&moveFR[j]!='x')
          {
            moveFrom = getAllRankFileSquares(moveFR[j]);
          }
          else if(moveTo!=-1)
          {
            currentMove = legalMoves.find((move)=>move.to==moveTo&&pieceToMove==move.piece&&moveFrom.includes(move.from));
               
          }
      }
    }
    const isHashKeyPresent = map.has(currentHashKey);
    if(isHashKeyPresent)
    {
        const moves = map.get(currentHashKey);
        const isMoveAlreadyPresent = moves.find(move=>move.to==currentMove.to&&move.from==currentMove.from&&currentMove.piece==move.piece);
        if(!isMoveAlreadyPresent)moves.push(currentMove);
    }
    else{
      map.set(currentHashKey,[]);
    }
    boardObj.handleMove(currentMove);
    currentHashKey = getHashKey(boardObj,'KQkq','-');

  }
}