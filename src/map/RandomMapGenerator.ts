
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

        const map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer('Tile Layer 1', this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing, 177);
        map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing, 180);
        map.addTilesetImage('MntMisc', 'MntMisc', tileSize, tileSize, 0, tileSpacing, 200);

        const points = [];
        this.fillRandom(points);
        this.smooth(points);
        this.fixMissingTextures(points);
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

    private getPoint(points: Array<Array<number>>, x: any, y: number): number
    {
        if (undefined === points[x]) {
            return null;
        }

        if (undefined === points[x][y]) {
            return null;
        }

        return points[x][y];
    }

    private fillRandom(points: Array<Array<number>>)
    {
        for (let x = 0; x <= this.screenWidth; x++) {
            let line = [];
            for (let y = 0; y <= this.screenHeight; y++) {
                line.push(Math.random() > 0.5 ? GRASS : MNT);
            }
            points.push(line);
        }
    }

    private smooth(points: Array<Array<number>>)
    {
        for (let x = 0; x <= this.screenWidth; x++) {
            for (let y = 0; y <= this.screenHeight; y++) {
                let aroundPoints = [
                    this.getPoint(points, x - 1, y - 1),
                    this.getPoint(points,x, y - 1),
                    this.getPoint(points,x + 1, y - 1),
                    this.getPoint(points,x - 1, y),
                    this.getPoint(points,x, y),
                    this.getPoint(points,x + 1, y),
                    this.getPoint(points,x - 1, y + 1),
                    this.getPoint(points,x, y + 1),
                    this.getPoint(points,x + 1, y + 1)
                ].filter(function (p) {
                    return null !== p;
                }).sort();
                points[x][y] = aroundPoints[Math.floor(aroundPoints.length / 2)];
            }
        }
    }

    private fixMissingTextures(points: Array<Array<number>>)
    {
        let maxLoops = 1000;
        let changes = true;

        while (maxLoops > 0 && changes) {
            changes = false;
            for (let x = 0; x < this.screenWidth; x++) {
                for (let y = 0; y < this.screenHeight; y++) {
                    if (null === RandomMapGenerator.getIndex(
                            this.getPoint(points,x, y),
                            this.getPoint(points,x + 1, y),
                            this.getPoint(points,x + 1, y + 1),
                            this.getPoint(points,x, y + 1)
                        )
                    ) {
                        points[x][y] = points[x][y] === MNT ? GRASS : MNT;
                        changes = true;
                    }
                }
            }
            maxLoops--;
        }
    }

    private putTiles(map: Phaser.Tilemap, points: Array<Array<number>>)
    {
        for (let x = 0; x < this.screenWidth; x++) {
            for (let y = 0; y <= this.screenHeight; y++) {
                map.putTile(RandomMapGenerator.getDecoratedIndex(
                    this.getPoint(points, x, y),
                    this.getPoint(points, x + 1, y),
                    this.getPoint(points, x + 1, y + 1),
                    this.getPoint(points, x, y + 1)
                ), x, y);
            }
        }
    }
}
