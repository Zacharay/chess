export let SQ64TO120 = Array(64).fill(-1);
export let SQ120TO64 = Array(120).fill(-1);

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

export const KNIGHT_DIR= [-21,-19,-8,12,21,19,-12,8];
export const ROCK_DIR= [10,-10,1,-1];
export const BISHOP_DIR= [11,-11,9,-9];
export const QUEEN_DIR= [11,-11,9,-9,10,-10,1,-1];
export const KING_DIR= [10,-10,11,-11,9,-9,1,-1];