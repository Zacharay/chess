import { isSquareAttacked } from "../helpers.js"
import MoveGenerator from "../MoveGenerator.js"
//Piece Square tables
const PawnTable = [
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    10, 10, 0 ,-10,-10, 0 , 10, 10,
    5 , 0 , 0 , 5 , 5 , 0 , 0 , 5 ,
    0 , 0 , 10, 20, 20, 10, 0 , 0 ,
    5 , 5 , 5 , 10, 10, 5 , 5 , 5 ,
    10, 10, 10, 20, 20, 10, 10, 10,
    20, 20, 20, 30, 30, 20, 20, 20,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]

const KnightTable = [
    0 ,-10, 0 , 0 , 0 , 0 ,-10, 0 ,
    0 , 0 , 0 , 5 , 5 , 0 , 0 , 0 ,
    0 , 0 , 10, 10, 10, 10, 0 , 0 ,
    0 , 0 , 10, 20, 20, 10, 5 , 0 ,
    5 , 10, 15, 20, 20, 15, 10, 5 ,
    5 , 10, 10, 20, 20, 10, 10, 5 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]

const BishopTable = [
    0 , 0 ,-10, 0 , 0 ,-10, 0 , 0 ,
    0 , 0 , 0 , 10, 10, 0 , 0 , 0 ,
    0 , 0 , 10, 15, 15, 10, 0 , 0 ,
    0 , 10, 15, 20, 20, 15, 10, 0 ,
    0 , 10, 15, 20, 20, 15, 10, 0 ,
    0 , 0 , 10, 15, 15, 10, 0 , 0 ,
    0 , 0 , 0 , 10, 10, 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]
const RookTable = [
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ,
    25, 25, 25, 25, 25, 25, 25, 25,
    0 , 0 , 5 , 10, 10, 5 , 0 , 0 ]

const Mirror = [
    56,57,58,59,60,61,62,63,
    48,49,50,51,52,53,54,55,
    40,41,42,43,44,45,46,47,
    32,33,34,35,36,37,38,39,
    24,25,26,27,28,29,30,31,
    16,17,18,19,20,21,22,23,
    8 ,9 ,10,11,12,13,14,15,
    0 ,1 ,2 ,3 ,4 ,5 ,6 , 7
]

const PieceValues = {
    'Pawn':100,
    'Knight':300,
    'Bishop':300,
    'Rook':500,
    'Queen':900,
    'King':0
}

export default function EvaluateFromSide(boardObj)
{
    const board = boardObj.getBoard();
    const side = boardObj.side;
    const moveGen = new MoveGenerator(boardObj);
    const moves = moveGen.getLegalMoves();

    const kingPos = boardObj.getKingPos(side);

    let score = 0;
    if(moves.length==0)
    {
        
        //draw
        if(!isSquareAttacked(kingPos,!side,board))
        {
            return 0;
        }
        //black loses
        if(side==0){
            return -Infinity;
        }
        //white loses
        else {
            return Infinity;
        }
    }

    let whiteMaterial=0;
    let blackMaterial=0;


    for(let i=0;i<board.length;i++)
    {
        if(board[i]=='')continue;
        
        //Count Material
        const pieceType = board[i].type;
        const pieceColor = board[i].isWhite
        const pieceValue = PieceValues[pieceType]
        
        if(pieceColor==1)whiteMaterial+=pieceValue;
        else blackMaterial+=pieceValue;

        //Apply piece tables
        const sq = pieceColor==1?Mirror[i]:i;

        let pieceTableValue=0;
        if(pieceType=='Pawn')
        {
            pieceTableValue = PawnTable[sq];
        }
        else if(pieceType=='Knight')
        {
            pieceTableValue = KnightTable[sq];
        }
        else if(pieceType=='Bishop')
        {
            pieceTableValue = BishopTable[sq];
        }
        else if(pieceType=='Rook')
        {
            pieceTableValue = RookTable[sq];
        }

        if(pieceColor==0)score+=pieceTableValue;
        else score -=pieceTableValue;
    }

    score += (blackMaterial - whiteMaterial);

    if(side==0)return score;
    else return -score;
    
}