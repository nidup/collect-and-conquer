
import {MapGenerator} from "./MapGenerator";

export class FileMapGenerator extends MapGenerator
{
    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);
    }

    generate(): Phaser.Tilemap
    {
        let tileSize = 20;
        let tileSpacing = 20;

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grass', 'Grass', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grass2', 'Grass2', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrasRoad', 'GrasRoad', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrassRDst', 'GrassRDst', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2CrtB', 'Grs2CrtB', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Crtc', 'Grs2Crtc', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Crtr', 'Grs2Crtr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Watr', 'Grs2Watr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grss2Lav', 'Grss2Lav', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing);

        var layer = this.map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        return this.map;
    }
}
