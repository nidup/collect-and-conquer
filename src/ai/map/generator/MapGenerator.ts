
import {Map} from "../Map";

export abstract class MapGenerator
{
    protected group: Phaser.Group;
    protected screenWidth: number;
    protected screenHeight: number;
    protected tilesize: number;

    constructor(group: Phaser.Group, screenWidth: number, screenHeight: number, tilesize: number)
    {
        this.group = group;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.tilesize = tilesize;
    }

    abstract generate(): Map;
}
