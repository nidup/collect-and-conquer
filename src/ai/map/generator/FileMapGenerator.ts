
import {MapGenerator} from "./MapGenerator";
import {Map} from "../Map";

export class FileMapGenerator extends MapGenerator
{
    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);
    }

    generate(): Map
    {
        let tileSize = 20;
        let tileSpacing = 20;

        const map = this.game.add.tilemap('level1');

        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grass', 'Grass', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grass2', 'Grass2', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('GrasRoad', 'GrasRoad', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('GrassRDst', 'GrassRDst', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grs2CrtB', 'Grs2CrtB', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grs2Crtc', 'Grs2Crtc', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grs2Crtr', 'Grs2Crtr', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grs2Watr', 'Grs2Watr', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('Grss2Lav', 'Grss2Lav', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing);
        map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing);

        const grounds = map.layers[0].data.reduce(
            function(groundRows: Array<Array<number>>, tileRow: Phaser.Tile[]) {
                groundRows.push(
                    tileRow.reduce(
                        function(groundRow: Array<number>, tile: Phaser.Tile) {
                            groundRow.push(tile.index);
                            return groundRow;
                        },
                        []
                    )
                );
                return groundRows;
            },
            []
        );

        return new Map(map, grounds);
    }
}
