export default class Engine{
    constructor()
    {
    }
    findNextMove(moves)
    {
        let move;
        move = moves[Math.floor(Math.random()*moves.length)];
        
        return move;
    }
}