
import {MapGenerator} from "./MapGenerator";
import {Tile} from "./Tile";
import {TileRegistry} from "./TilesRegistry";
import {Map} from "../Map";

const DECORATION_RANDOM = 0.05;
const SMOOTH_LOOPS = 3;

// TODO move this
const DECO = [
    [Tile.GRASS, 177, 178, 179, 185, 186, 188, 189, 190],
    [Tile.MNT, 200, 201, 202, 203, 204, 205]
];

const tileSize = 20;
const tileSpacing = 20;

export class RandomMapGenerator extends MapGenerator
{
    private tileRegistry: TileRegistry;

    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number)
    {
        super(game, screenWidth, screenHeight);

        this.tileRegistry = new TileRegistry();
    }

    generate(): Map
    {
        const map = this.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);

        map.removeAllLayers();
        map.createBlankLayer(MapGenerator.LAYER_NAME, this.screenWidth/tileSize, this.screenHeight/tileSize, tileSize, tileSize);
        this.addTileSets(map);

        let points = [];
        this.fillRandom(points);
        for (let loops = SMOOTH_LOOPS; loops > 0; loops--) {
            points = this.smooth(points);
        }
        points = this.fixMissingTextures(points);
        this.draw(map, points);

        return new Map(map, points);
    }

    /**
     * Adds the tilesets used for this map generation, and the associated tiles for the tiles registry.
     *
     * @param map
     */
    private addTileSets(map: Phaser.Tilemap) {
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        this.tileRegistry.addTile(new Tile(35, Tile.GRASS, Tile.GRASS, Tile.GRASS, Tile.GRASS));

        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        this.tileRegistry.addTile(new Tile(132, Tile.MNT, Tile.MNT, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(133, Tile.MNT, Tile.MNT, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(134, Tile.MNT, Tile.MNT, Tile.MNT, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(135, Tile.MNT, Tile.GRASS, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(136, Tile.MNT, Tile.MNT, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(137, Tile.GRASS, Tile.MNT, Tile.MNT, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(138, Tile.MNT, Tile.GRASS, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(139, Tile.GRASS, Tile.GRASS, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(140, Tile.GRASS, Tile.MNT, Tile.MNT, Tile.MNT));
        this.tileRegistry.addTile(new Tile(142, Tile.MNT, Tile.GRASS, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(143, Tile.GRASS, Tile.MNT, Tile.GRASS, Tile.GRASS));
        this.tileRegistry.addTile(new Tile(145, Tile.GRASS, Tile.GRASS, Tile.GRASS, Tile.MNT));
        this.tileRegistry.addTile(new Tile(146, Tile.GRASS, Tile.GRASS, Tile.MNT, Tile.GRASS));

        map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing, 177);
        map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing, 180);
        map.addTilesetImage('MntMisc', 'MntMisc', tileSize, tileSize, 0, tileSpacing, 200);
    }

    /**
     * Returns the current ground at this position.
     * If there is no ground (out of bounds), returns null.
     *
     * @param points {Array<Array<number>>}
     * @param x {number}
     * @param y {number}
     * @returns {number|null}
     */
    private static getGround(points: Array<Array<number>>, x: any, y: number): number|null
    {
        if (undefined === points[y]) {
            return null;
        }

        return (undefined === points[y][x]) ? null : points[y][x];
    }

    /**
     * Fills the points with random grounds.
     *
     * @param points
     */
    private fillRandom(points: Array<Array<number>>)
    {
        for (let y = 0; y <= this.screenHeight / tileSize + 1; y++) {
            let line = [];
            for (let x = 0; x < this.screenWidth / tileSize + 1; x++) {
                line.push(Math.random() > 0.4 ? Tile.GRASS : Tile.MNT);
            }
            points.push(line);
        }
    }

    /**
     * Smooths the current points from their neighbors.
     *
     * @param points
     * @returns Array<Array<number>>
     */
    private smooth(points: Array<Array<number>>): Array<Array<number>>
    {
        const smoothCell = function(index: number, x: number, y: number): number {
            const gaps = [-1, 0, 1];

            let aroundPoints = gaps.reduce(function (lines, gapLine) {
                return lines.concat(gaps.reduce(function (cells, gapCell) {
                    cells.push(RandomMapGenerator.getGround(points, x  + gapCell, y  + gapLine));

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

    /**
     * This function will prevent usage of non existing textures. For example, there is no texture with grass on the
     * top left corner and the bottom right corner plus mountain on the top right corner and bottom left corner.
     * This function will execute passes as needed to update grounds at single points, until there is no more
     * non existing textures.
     *
     * @param points
     * @returns {Array<Array<number>>}
     */
    private fixMissingTextures(points: Array<Array<number>>): Array<Array<number>>
    {
        let maxLoops = 1000;
        let changes = true;
        let result = points;

        // TODO I didn't found any other way to do this with `bind` methods...
        let zthis = this;

        const switchCell = function (cell, x, y) {
            let topLeft = RandomMapGenerator.getGround(result, x, y);
            let topRight = RandomMapGenerator.getGround(result, x + 1, y);
            let bottomRight = RandomMapGenerator.getGround(result, x + 1, y + 1);
            let bottomLeft = RandomMapGenerator.getGround(result, x, y + 1);

            if (null !== topRight
                && null !== bottomLeft
                && null === zthis.tileRegistry.find({
                    topLeft: topLeft,
                    topRight: topRight,
                    bottomRight: bottomRight,
                    bottomLeft: bottomLeft
                })
            ) {
                changes = true;

                return zthis.tileRegistry.getClosestTileIndex(topLeft, topRight, bottomRight, bottomLeft);
            } else {
                return cell;
            }
        };

        while (maxLoops > 0 && changes) {
            changes = false;
            result = result.map(function (line, y) {
                return line.map(function (cell, x) {
                    return switchCell(cell, x, y);
                });
            });
            maxLoops--;
        }

        return result;
    }

    /**
     * Draws the final render, using indexes of the tiles.
     *
     * @param map
     * @param points
     */
    private draw(map: Phaser.Tilemap, points: Array<Array<number>>)
    {
        points.forEach(function (line, y) {
            line.forEach(function (cell, x) {
                let decoratedIndex = this.getDecoratedIndex(
                    RandomMapGenerator.getGround(points, x, y),
                    RandomMapGenerator.getGround(points, x + 1, y),
                    RandomMapGenerator.getGround(points, x + 1, y + 1),
                    RandomMapGenerator.getGround(points, x, y + 1)
                );
                map.putTile(decoratedIndex, x, y);
            }.bind(this))
        }.bind(this));
    }

    /**
     * Returns the index of the tile to display
     * This tile is "decorated", i.e. it can randomly contains a decoration.
     *
     * @param topLeft     The type of ground of the topLeft
     * @param topRight    The type of ground of the topRight
     * @param bottomRight The type of ground of the bottomRight
     * @param bottomLeft  The type of ground of the bottomLeft
     *
     * @returns {number}
     */
    private getDecoratedIndex(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number
    {
        let undecoratedGround = this.tileRegistry.find({
            topLeft: topLeft,
            topRight: topRight,
            bottomRight: bottomRight,
            bottomLeft: bottomLeft
        }).index;

        for (let i = 0; i < DECO.length; i++) {
            let decoratedGrounds = DECO[i];
            if (decoratedGrounds[0] === undecoratedGround && Math.random() < DECORATION_RANDOM) {
                return decoratedGrounds[1 + Math.floor(Math.random() * (decoratedGrounds.length - 1))];
            }
        }

        return undecoratedGround;
    }
}
