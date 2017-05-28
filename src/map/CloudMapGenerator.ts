
import {MapGenerator} from "./MapGenerator";

const tileSize = 20;
const tileSpacing = 20;

export class CloudMapGenerator extends MapGenerator
{
    generate(): Phaser.Tilemap
    {
        const map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer(MapGenerator.LAYER_NAME, this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        this.addTileSets(map);

        let points = [];
        let minSize = 1;
        let maxSize = 5;
        let countX = 4;
        let countY = 4;
        let matrixs = [];
        let maxY = countY * Math.pow(2, maxSize);
        let maxX = countX * Math.pow(2, maxSize);

        for (let size = minSize; size < maxSize; size++) {
            let rudePoints = [];
            let blockSize = Math.pow(2, size);

            for (let y = 0; y < maxY; y += blockSize) {
                for (let x = 0; x < maxX; x += blockSize) {
                    let random = Math.round(Math.random());
                    for (let yi = 0; yi < blockSize; yi++) {
                        for (let xi = 0; xi < blockSize; xi++) {
                            if (undefined === rudePoints[y + yi]) {
                                rudePoints[y + yi] = [];
                            }
                            rudePoints[y + yi][x + xi] = random;
                        }
                    }
                }
            }

            let smooth = [];
            for (let y = 0; y < maxY; y++) {
                for (let x = 0; x < maxX; x++) {
                    let diff = Math.ceil(Math.pow(2, size) / 2);
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
            matrixs[size] = smooth;
        }

        for (let y = 0; y < maxY; y++) {
            for (let x = 0; x < maxX; x ++) {
                if (undefined === points[y]) {
                    points[y] = [];
                }
                let sum = 0;
                let count = 0;
                for (let size = minSize; size < maxSize; size++) {
                    sum += (size + 1) * matrixs[size][x][y];
                    count += (size + 1);
                }
                points[y][x] = sum / count;
            }
        }

        //this.draw(map, matrixs[4]);
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
}
