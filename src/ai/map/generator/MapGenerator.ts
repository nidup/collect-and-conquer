
import {Map} from "../Map";

export abstract class MapGenerator
{
    public static LAYER_NAME: string = 'Tiles';
    protected screenWidth: number;
    protected screenHeight: number;
    protected game: Phaser.Game;

    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.game = game;
    }

    abstract generate(): Map;
}
