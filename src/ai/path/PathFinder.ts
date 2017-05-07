
import {Path} from "./Path";
// TODO: how to fix or not fix the following?
import * as EasyStar from "../../../node_modules/easystarjs"

export class PathFinder {

    private map: Phaser.Tilemap;
    private easystar;

    constructor(map: Phaser.Tilemap, acceptableTiles: Array<number>)
    {
        this.map = map;

        // cf https://github.com/prettymuchbryce/easystarjs
        this.easystar = new EasyStar.js();
        let mapData = map.layers[0].data;
        let grid = [];
        for (let i = 0; i < mapData.length; i++) {
            grid[i] = [];
            for (let j = 0; j < mapData[i].length; j++) {
                grid[i][j] = this.map.layers[0].data[i][j].index;
            }
        }
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles(acceptableTiles);
        this.easystar.enableSync();
        this.easystar.enableDiagonals();
    }

    public findPath(startX: number, startY: number, endX: number, endY: number)
    {
        let foundPath = null;
        let pathCallback = function(path) {
            if (path === null) {
                console.log("path not found");
            } else {
                foundPath = new Path(path);
            }
        };
        this.easystar.findPath(startX, startY, endX, endY, pathCallback);
        this.easystar.calculate();

        return foundPath;
    }
}
