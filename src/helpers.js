export let SQ64TO120 = Array(64).fill(-1);
export let SQ120TO64 = Array(120).fill(-1);
export let sqToFile =[];
export let sqToRank = [];
export const KNIGHT_DIR= [-21,-19,-8,12,21,19,-12,8];
export const ROCK_DIR= [10,-10,1,-1];
export const BISHOP_DIR= [11,-11,9,-9];
export const QUEEN_DIR= [11,-11,9,-9,10,-10,1,-1];
export const KING_DIR= [10,-10,11,-11,9,-9,1,-1];
export function fileRankToSq(fileRank)
{
    for(let i=0;i<64;i++)
    {
        if(sqToPGN[i]==fileRank)return i;
    }
    return -1;
}
export function getAllRankFileSquares(symbol)
{
    let ans=[];
    for(let i=0;i<64;i++)
    {
        if(sqToFile[i]==symbol||sqToRank[i]==symbol)ans.push(i);
    }
    return ans;
}
let sq64 = 21;
for(let rank=0;rank<8;rank++)
{
    for(let file=0;file<8;file++)
    {
        const sq = file+rank*8;
        SQ64TO120[sq]=sq64;
        SQ120TO64[sq64]=sq;
        sq64++;
    }
    sq64+=2;
}

const file = ['a','b','c','d','e','f','g','h'];
for(let i=0;i<8;i++)
{
    sqToFile.push(...file);
}
let counter = 8;
for(let i=0;i<8;i++)
{
    for(let j=0;j<8;j++)
    {
        sqToRank.push(counter);
    }
    counter--;
}

let sqToPGN = [];

for(let i=0;i<64;i++)
{
    const pgnNotation = sqToFile[i]+sqToRank[i];
    sqToPGN.push(pgnNotation);
}


