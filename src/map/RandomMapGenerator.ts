
import {MapGenerator} from "./MapGenerator";

const GRASS = 35;
const MNT = 136;

const TILES = [
    [132, MNT, MNT, GRASS, MNT],
    [133, MNT, MNT, GRASS, GRASS],
    [134, MNT, MNT, MNT, GRASS],
    [135, MNT, GRASS, GRASS, MNT],
    [136, MNT, MNT, MNT, MNT],
    [137, GRASS, MNT, MNT, GRASS],
    [138, MNT, GRASS, MNT, MNT],
    [139, GRASS, GRASS, MNT, MNT],
    [140, GRASS, MNT, MNT, MNT],
    [142, MNT, GRASS, GRASS, GRASS],
    [143, GRASS, MNT, GRASS, GRASS],
    [145, GRASS, GRASS, GRASS, MNT],
    [146, GRASS, GRASS, MNT, GRASS],
    [35, GRASS, GRASS, GRASS, GRASS]
];

const DECO = [
    [GRASS, 177, 178, 179, 185, 186, 188, 189, 190],
    [MNT, 200, 201, 202, 203, 204, 205]
];

const tileSize = 20;
const tileSpacing = 20;

export class RandomMapGenerator extends MapGenerator
{
    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);
    }

    generate(): Phaser.Tilemap
    {
        const map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer(MapGenerator.LAYER_NAME, this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing, 177);
        map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing, 180);
        map.addTilesetImage('MntMisc', 'MntMisc', tileSize, tileSize, 0, tileSpacing, 200);

        let points = [];
        this.fillRandom(points);
        points = this.smooth(points);
        points = this.fixMissingTextures(points);
        this.putTiles(map, points);

        return map;
    }

    private static getDecoratedIndex(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number
    {
        let undecorated = RandomMapGenerator.getIndex(topLeft, topRight, bottomRight, bottomLeft);
        for (let i = 0; i < DECO.length; i++) {
            let decorateds = DECO[i];
            if (decorateds[0] === undecorated && Math.random() < 0.05) {
                return decorateds[1 + Math.floor(Math.random() * (decorateds.length - 1))];
            }
        }

        return undecorated;
    }

    private static getIndex(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number
    {
        for (let i = 0; i < TILES.length; i++) {
            if (TILES[i][1] === topLeft
                && TILES[i][2] === topRight
                && TILES[i][3] === bottomRight
                && TILES[i][4] === bottomLeft) {
                return TILES[i][0];
            }
        }

        return null;
    }

    private static getPoint(points: Array<Array<number>>, x: any, y: number): number
    {
        if (undefined === points[y]) {
            return null;
        }

        if (undefined === points[y][x]) {
            return null;
        }

        return points[y][x];
    }

    private fillRandom(points: Array<Array<number>>)
    {
        for (let y = 0; y <= this.screenHeight / tileSize + 1; y++) {
            let line = [];
            for (let x = 0; x < this.screenWidth / tileSize + 1; x++) {
                line.push(Math.random() > 0.5 ? GRASS : MNT);
            }
            points.push(line);
        }
    }

    private smooth(points: Array<Array<number>>): Array<Array<number>>
    {
        const smoothCell = function(index: number, x: number, y: number): number {
            const gaps = [-1, 0, 1];

            let aroundPoints = gaps.reduce(function (lines, gapLine) {
                return lines.concat(gaps.reduce(function (cells, gapCell) {
                    cells.push(RandomMapGenerator.getPoint(points, x  + gapCell, y  + gapLine));

                    return cells;
                }, []));
            }, []).filter(function (p) {
                return null !== p;
            }).sort();

            return aroundPoints[Math.floor(aroundPoints.length / 2)];
        };

        return points.map(function (line, y) {
            return line.map(function (cell, x) {
                return smoothCell(cell, x, y);
            });
        });
    }

    private fixMissingTextures(points: Array<Array<number>>): Array<Array<number>>
    {
        let maxLoops = 1000;
        let changes = true;
        let result = points;

        while (maxLoops > 0 && changes) {
            changes = false;
            result = result.map(function (line, y) {
                return line.map(function (cell, x) {
                    let topLeft = RandomMapGenerator.getPoint(result, x, y);
                    let topRight = RandomMapGenerator.getPoint(result, x + 1, y);
                    let bottomRight = RandomMapGenerator.getPoint(result, x + 1, y + 1);
                    let bottomLeft = RandomMapGenerator.getPoint(result, x, y + 1);

                    if (null !== topRight
                        && null !== bottomLeft
                        && null !== bottomRight
                        && null === RandomMapGenerator.getIndex(topLeft, topRight, bottomRight, bottomLeft)
                    ) {
                        changes = true;

                        return cell === MNT ? GRASS : MNT;
                    } else {
                        return cell;
                    }
                });
            });
            maxLoops--;
        }

        return result;
    }

    private putTiles(map: Phaser.Tilemap, points: Array<Array<number>>)
    {
        points.forEach(function (line, y) {
            line.forEach(function (cell, x) {
                let decoratedIndex = RandomMapGenerator.getDecoratedIndex(
                    RandomMapGenerator.getPoint(points, x, y),
                    RandomMapGenerator.getPoint(points, x + 1, y),
                    RandomMapGenerator.getPoint(points, x + 1, y + 1),
                    RandomMapGenerator.getPoint(points, x, y + 1)
                );
                map.putTile(decoratedIndex, x, y);
            })
        });
    }
}
