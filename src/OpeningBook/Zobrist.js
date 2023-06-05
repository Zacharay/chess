import { RandomNumbers } from "./RandomNumbers.js";


export function getHashKey(board,castlePerms,enPassantMove,turn)
{
    //key=piece^castle^enPassant^turn
    
    let pieceKey = 0;
    for(let rank=0;rank<8;rank++)
    {
        for(let file = 0;file<8;file++)
        {
            const sq = file + rank*8;
            const piece = board[sq];
            if(piece == '')continue;

            const piece_offset = 64*getPieceValue(piece.symbol)+8*rank+file;
            pieceKey ^= RandomNumbers[piece_offset];
        }
    }
    
    let castle=0;
    const baseCastleOffset = 768;
    for(let i=0;i<castlePerms.length;i++)
    {
      const offset = baseCastleOffset + getCastleOffset(castlePerms[i]);
      castle ^= RandomNumbers[offset];
    }
   
    
    const baseEnOffset = 772;
    let enPassant=0;
    if(enPassantMove!='-')
    {
      enPassant = RandomNumbers[baseEnOffset+getFileValue(enPassantMove[0])];
    }
    

    const turnKey = turn==1?RandomNumbers[780]:0;
    const key = pieceKey^castle^enPassant^turnKey
}
function getFileValue(file)
{
    if(file=='a')return 0;
    if(file=='b')return 1;
    if(file=='c')return 2;
    if(file=='d')return 3;
    if(file=='e')return 4;
    if(file=='f')return 5;
    if(file=='g')return 6;
    if(file=='h')return 7;
}
function getCastleOffset(castleRight)
{
  if(castleRight=='K')return 0;
  if(castleRight=='Q')return 1;
  if(castleRight=='k')return 2;
  if(castleRight=='q')return 3;
}
function getPieceValue(symbol)
{
  if(symbol=='bP')return 0;
  if(symbol=='wP')return 1;
  if(symbol=='bN')return 2;
  if(symbol=='wN')return 3;
  if(symbol=='bB')return 4;
  if(symbol=='wB')return 5;
  if(symbol=='bR')return 6;
  if(symbol=='wR')return 7;
  if(symbol=='bQ')return 8;
  if(symbol=='wQ')return 9;
  if(symbol=='bK')return 10;
  if(symbol=='wK')return 11;
}

