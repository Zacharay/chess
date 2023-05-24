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
