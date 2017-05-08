
import {TilePositionPath} from "./TilePositionPath";
// TODO: how to fix or not fix the following?
import * as EasyStar from "../../../node_modules/easystarjs"
import {TilePosition} from "./TilePosition";

export class PathFinder
{
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

    public findTilePositionPath(start: TilePosition, end: TilePosition)
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
}
