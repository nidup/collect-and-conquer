
import {Map} from "../Map";

export abstract class MapGenerator
{
    protected game: Phaser.Game;
    protected screenWidth: number;
    protected screenHeight: number;
    protected tilesize: number;

    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number, tilesize: number)
    {
        this.game = game;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.tilesize = tilesize;
    }

    abstract generate(): Map;
}
