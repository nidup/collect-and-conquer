
import {Player} from "./Player";

export class PlayerRepository
{
    private players: Player[];

    public constructor()
    {
        this.players = [];
    }

    public add(player: Player)
    {
        this.players.push(player);
    }

    public all(): Player[]
    {
        return this.players;
    }

    public human(): Player
    {
        return this.all().filter(function(player: Player) { return player.isHuman(); })[0];
    }

    public bots(): Player[]
    {
        return this.all().filter(function(player: Player) { return player.isHuman() == false; });
    }
}
