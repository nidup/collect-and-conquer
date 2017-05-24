
import {MapGenerator} from "./MapGenerator";

const GRASS = 35;
const MNT = 136;
const TILES = [
    [MNT, MNT, GRASS, MNT, 132],
    [MNT, MNT, GRASS, GRASS, 133],
    [MNT, MNT, MNT, GRASS, 134],
    [MNT, GRASS, GRASS, MNT, 135],
    [MNT, MNT, MNT, MNT, 136],
    [GRASS, MNT, MNT, GRASS, 137],
    [MNT, GRASS, MNT, MNT, 138],
    [GRASS, GRASS, MNT, MNT, 139],
    [GRASS, MNT, MNT, MNT, 140],
    [MNT, GRASS, GRASS, GRASS, 142],
    [GRASS, MNT, GRASS, GRASS, 143],
    [GRASS, GRASS, GRASS, MNT, 145],
    [GRASS, GRASS, MNT, GRASS, 146],
    [GRASS, GRASS, GRASS, GRASS, 35]
];

const DECO = {
    GRASS: [177, 178, 179, 185, 186, 188, 189, 190],
    MNT: [200, 201, 202, 203, 204, 205]
};

export class RandomMapGenerator extends MapGenerator
{
    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);
    }

    generate(): Phaser.Tilemap
    {
        let x, y: number;

        const tileSize = 20;
        const tileSpacing = 20;

        this.map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        this.map.removeAllLayers();
        this.map.createBlankLayer('layername', this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        this.map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);

        this.map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing, 177);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing, 180);
        this.map.addTilesetImage('MntMisc', 'MntMisc', tileSize, tileSize, 0, tileSpacing, 200);

        let points = [];
        for (x = 0; x <= this.screenWidth; x++) {
            let line = [];
            for (y = 0; y <= this.screenHeight; y++) {
                line.push(Math.random() > 0.5 ? GRASS : MNT);
            }
            points.push(line);
        }

        for (x = 0; x <= this.screenWidth; x++) {
            for (y = 0; y <= this.screenHeight; y++) {
                let aroundPoints = [
                    RandomMapGenerator.getPoint(points, x - 1, y - 1),
                    RandomMapGenerator.getPoint(points, x, y - 1),
                    RandomMapGenerator.getPoint(points, x + 1, y - 1),
                    RandomMapGenerator.getPoint(points, x - 1, y),
                    RandomMapGenerator.getPoint(points, x, y),
                    RandomMapGenerator.getPoint(points, x + 1, y),
                    RandomMapGenerator.getPoint(points, x - 1, y + 1),
                    RandomMapGenerator.getPoint(points, x, y + 1),
                    RandomMapGenerator.getPoint(points, x + 1, y + 1)
                ].filter(function (p) {
                    return null !== p;
                }).sort();
                points[x][y] = aroundPoints[Math.floor(aroundPoints.length / 2)];
            }
        }

        let maxLoops = 1000;
        let changes = true;
        while (maxLoops > 0 && changes) {
            changes = false;
            for (x = 0; x < this.screenWidth; x++) {
                for (y = 0; y < this.screenHeight; y++) {
                    if (null === RandomMapGenerator.getIndexFromPoints(
                            RandomMapGenerator.getPoint(points, x, y),
                            RandomMapGenerator.getPoint(points, x + 1, y),
                            RandomMapGenerator.getPoint(points, x + 1, y + 1),
                            RandomMapGenerator.getPoint(points, x, y + 1)
                        )
                    ) {
                        points[x][y] = points[x][y] === MNT ? GRASS : MNT;
                        changes = true;
                    }
                }
            }
            maxLoops--;
        }

        for (x = 0; x < this.screenWidth; x++) {
            for (y = 0; y <= this.screenHeight; y++) {
                this.map.putTile(RandomMapGenerator.getDecoratedIndexFromPoints(
                    RandomMapGenerator.getPoint(points, x, y),
                    RandomMapGenerator.getPoint(points, x + 1, y),
                    RandomMapGenerator.getPoint(points, x + 1, y + 1),
                    RandomMapGenerator.getPoint(points, x, y + 1)
                ), x, y);
            }
        }

        return this.map;
    }

    private static getDecoratedIndexFromPoints(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number {
        let undecorated = RandomMapGenerator.getIndexFromPoints(topLeft, topRight, bottomRight, bottomLeft);
        let decorateds = [];
        if (undecorated === GRASS) {
            decorateds = DECO.GRASS;
        } else if (undecorated === MNT) {
            decorateds = DECO.MNT;
        }
        if (decorateds.length && Math.random() < 0.05) {
            return decorateds[Math.floor(Math.random() * decorateds.length)];
        }

        return undecorated;
    }

    private static getIndexFromPoints(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number {
        for (let i = 0; i < TILES.length; i++) {
            if (TILES[i][0] === topLeft
                && TILES[i][1] === topRight
                && TILES[i][2] === bottomRight
                && TILES[i][3] === bottomLeft) {
                return TILES[i][4];
            }
        }

        return null;
    }

    private static getPoint(points: Array<Array<number>>, x: any, y: number) {
        if (undefined === points[x]) {
            return null;
        }

        if (undefined === points[x][y]) {
            return null;
        }

        return points[x][y];
    }
}
