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
export function isSquareAttacked(sq,side,board)
{
    sq = SQ64TO120[sq];
    
    //white side Pawns
    if(side)
    {
        if(
            (board[SQ120TO64[sq+9]]?.type=='Pawn'&&board[SQ120TO64[sq+9]]?.isWhite==side)||
            (board[SQ120TO64[sq+11]]?.type=='Pawn'&&board[SQ120TO64[sq+11]]?.isWhite==side))
        {
            return true;
        }
    }
    //Black side pawns
    else{
        if(
        (board[SQ120TO64[sq-9]]?.type=='Pawn'&&board[SQ120TO64[sq-9]]?.isWhite==side)||
        (board[SQ120TO64[sq-11]]?.type=='Pawn'&&board[SQ120TO64[sq-11]]?.isWhite==side))
        {
            return true;
        } 
    }

    
    //check knight attacks
    for(let i=0;i<KNIGHT_DIR.length;i++)
    {
        const dir = KNIGHT_DIR[i];
        const temp_sq = sq + dir;
        if(SQ120TO64[temp_sq]==-1)continue;
        const piece = board[SQ120TO64[temp_sq]]
        if(piece!=''&&piece.type=='Knight'&&piece.isWhite==side)
        {
            return true;
        }
    }

    //check bishop and queen attacks(diagonal)
    for(let i=0;i<BISHOP_DIR.length;i++)
    {
        const dir = BISHOP_DIR[i];
        let pos120 = sq+dir;
        let temp_sq =SQ120TO64[pos120];
        if(temp_sq==-1)continue;
        let piece = board[temp_sq];
        
        while(temp_sq!=-1)
        {
            if(piece!='')
            {
                if((piece.type=='Bishop'||piece.type=='Queen')&&piece.isWhite==side)
                {
                    return true;
                }
                break;
            }
            pos120 +=dir;
            temp_sq = SQ120TO64[pos120];
            piece = board[temp_sq];
        }
    }
    for(let i=0;i<ROCK_DIR.length;i++)
    {
        const dir = ROCK_DIR[i];
        let pos120 = sq+dir;
        let temp_sq =SQ120TO64[pos120];
        if(temp_sq==-1)continue;
        let piece = board[temp_sq];
        while(temp_sq!=-1)
        {
            if(piece!='')
            {
                if((piece.type=='Rook'||piece.type=='Queen')&&piece.isWhite==side)
                {
                    return true;
                }
                
                break;
            }
            pos120 +=dir;
            temp_sq = SQ120TO64[pos120];
            piece = board[temp_sq];
        }
    }
    
    for(let i=0;i<KING_DIR.length;i++)
    {
        const dir = KING_DIR[i];
        const temp_sq = SQ120TO64[dir+sq];
        if(temp_sq==-1)continue;
        const piece = board[temp_sq]
        if(piece!=''&&piece.type=='King'&&piece.isWhite==side)
        {
            return true;
        }

    }
    return false;
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


const movesPgn = document.querySelectorAll(".tview2 .hist");

let final = '';
movesPgn.forEach(move=>{
    final+=move.innerHTML +' ';
})
console.log(movesPgn);