
import {MapGenerator} from "./MapGenerator";

const tileSize = 20;
const tileSpacing = 20;

const MIN_POWER = 1;
const MAX_POWER = 5;

export class CloudMapGenerator extends MapGenerator
{
    generate(): Phaser.Tilemap
    {
        const map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer(MapGenerator.LAYER_NAME, this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);

        this.addTileSets(map);

        let mapSizeY = 4 * Math.pow(2, MAX_POWER);
        let mapSizeX = 4 * Math.pow(2, MAX_POWER);
        let cloudMaps = this.generateCloudMaps(mapSizeY, mapSizeX);
        let points = this.mixCloudMaps(cloudMaps);

        this.draw(map, points);

        return map;
    }

    /**
     * Adds the tilesets used for this map generation, and the associated tiles for the tiles registry.
     *
     * @param map
     */
    private addTileSets(map: Phaser.Tilemap) {
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing, 177);
        map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing, 180);
        map.addTilesetImage('MntMisc', 'MntMisc', tileSize, tileSize, 0, tileSpacing, 200);
    }

    private draw(map: Phaser.Tilemap, points: Array<Array<number>>)
    {
        points.forEach(function (line, y) {
            line.forEach(function (cell, x) {
                let decoratedIndex = cell > 0.25 ? (cell > 0.5 ? (cell > 0.75 ? 132 : 177) : 179) : 35;
                map.putTile(decoratedIndex, x, y);
            }.bind(this))
        }.bind(this));
    }

    private generateCloudMaps(mapSizeY: number, mapSizeX: number): Array<Array<Array<number>>> {
        let cloudMaps = [];

        for (let power = MIN_POWER; power < MAX_POWER; power++) {
            cloudMaps[power] = this.smoothMap(power, this.generateRandomSquares(power, mapSizeY, mapSizeX));
        }

        return cloudMaps;
    }

    private generateRandomSquares(power: number, mapSizeY: number, mapSizeX: number): Array<Array<number>> {
        let squaresMap = [];
        let blockSize = Math.pow(2, power);

        for (let y = 0; y < mapSizeY; y += blockSize) {
            for (let x = 0; x < mapSizeX; x += blockSize) {
                let random = Math.round(Math.random());
                for (let yi = 0; yi < blockSize; yi++) {
                    for (let xi = 0; xi < blockSize; xi++) {
                        if (undefined === squaresMap[y + yi]) {
                            squaresMap[y + yi] = [];
                        }
                        squaresMap[y + yi][x + xi] = random;
                    }
                }
            }
        }

        return squaresMap;
    }

    private smoothMap(power: number, rudePoints: Array<Array<number>>): Array<Array<number>> {
        let diff = Math.ceil(Math.pow(2, power) / 2);

        let smooth = [];
        for (let y = 0; y < rudePoints.length; y++) {
            for (let x = 0; x < rudePoints[y].length; x++) {
                let sum = 0;
                let count = 0;
                for (let yi = -diff; yi <= diff; yi++) {
                    for (let xi = -diff; xi <= diff; xi++) {
                        if (undefined !== rudePoints[y + yi] && undefined !== rudePoints[y + yi][x + xi]) {
                            sum += rudePoints[y + yi][x + xi];
                            count += 1;
                        }
                    }
                }
                if (undefined === smooth[y]) {
                    smooth[y] = [];
                }
                smooth[y][x] = sum / count;
            }
        }

        return smooth;
    }

    private mixCloudMaps(cloudMaps: Array<Array<Array<number>>>): Array<Array<number>> {
        let points = [];

        for (let y = 0; y < cloudMaps[MIN_POWER].length; y++) {
            for (let x = 0; x < cloudMaps[MIN_POWER][0].length; x ++) {
                if (undefined === points[y]) {
                    points[y] = [];
                }

                let sum = 0;
                let count = 0;
                for (let size = MIN_POWER; size < MAX_POWER; size++) {
                    sum += (size + 1) * cloudMaps[size][x][y];
                    count += (size + 1);
                }
                points[y][x] = sum / count;
            }
        }

        return points;
    }
}
