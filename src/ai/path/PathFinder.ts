
import {TilePositionPath} from "./TilePositionPath";
// TODO: how to fix or not fix the following?
import * as EasyStar from "../../../node_modules/easystarjs"
import {TilePosition} from "./TilePosition";
import {PhaserPointPath} from "./PhaserPointPath";

export class PathFinder
{
    private static TILE_SIZE: number = 20;
    private easystar;

    constructor(mapData, acceptableTiles: Array<number>)
    {
        // cf https://github.com/prettymuchbryce/easystarjs
        this.easystar = new EasyStar.js();
        let grid = [];
        for (let i = 0; i < mapData.length; i++) {
            grid[i] = [];
            for (let j = 0; j < mapData[i].length; j++) {
                grid[i][j] = mapData[i][j].index;
            }
        }
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles(acceptableTiles);
        this.easystar.enableSync();
        this.easystar.enableDiagonals();
    }

    public findTilePositionPath(start: TilePosition, end: TilePosition): TilePositionPath
    {
        let foundPath = null;
        let pathCallback = function(path) {
            if (path === null) {
                console.log("path not found");
            } else {
                foundPath = new TilePositionPath(path);
            }
        };
        this.easystar.findPath(start.getX(), start.getY(), end.getX(), end.getY(), pathCallback);
        this.easystar.calculate();

        return foundPath;
    }

    public findPhaserPointPath(start: Phaser.Point, end: Phaser.Point): PhaserPointPath
    {
        let foundPath = this.findTilePositionPath(
            this.convertToTilePosition(start),
            this.convertToTilePosition(end)
        );

        if (foundPath) {
            const points = new Array<Phaser.Point>();
            const nodes = foundPath.getNodes();
            for (let index = 0; index < nodes.length; index++) {
                let point = this.convertToPhaserPoint(nodes[index]);
                points.push(point);
            }

            return new PhaserPointPath(points);
        }

        return null;
    }

    private convertToTilePosition(point: Phaser.Point) :TilePosition
    {
        return new TilePosition(
            Math.ceil(point.x / PathFinder.TILE_SIZE) - 1,
            Math.ceil(point.y / PathFinder.TILE_SIZE) - 1
        );
    }

    private convertToPhaserPoint(position: TilePosition) :Phaser.Point
    {
        // round to the center of the tile
        return new Phaser.Point(
            position.getX() * PathFinder.TILE_SIZE + PathFinder.TILE_SIZE / 2,
            position.getY() * PathFinder.TILE_SIZE + PathFinder.TILE_SIZE / 2,
        );
    }
}
