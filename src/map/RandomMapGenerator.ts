
import {MapGenerator} from "./MapGenerator";

export class RandomMapGenerator extends MapGenerator
{
    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);
    }

    generate(): Phaser.Tilemap
    {
        const tileSize = 20;
        const tileSpacing = 20;

        this.map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        this.map.removeAllLayers();
        this.map.createBlankLayer('layername', this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        this.map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 1);

        this.map.fill(5, 0, 0,  this.screenWidth/tileSize, this.screenHeight/tileSize);

        return this.map;
    }
}
