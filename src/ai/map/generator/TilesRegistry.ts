
import {Tile} from "./Tile";

export class TileRegistry
{
    private tiles: Array<Tile>;

    constructor()
    {
        this.tiles = [];
    }

    addTile(tile: Tile)
    {
        this.tiles.push(tile);
    }

    findAll(param: {topLeft?: number; topRight?: number; bottomRight?: number; bottomLeft?: number}): Array<Tile>
    {
        return this.tiles.filter(function(tile) {
            if (param.topLeft && tile.topLeft !== param.topLeft) {
                return false;
            }
            if (param.topRight && tile.topRight !== param.topRight) {
                return false;
            }
            if (param.bottomRight && tile.bottomRight !== param.bottomRight) {
                return false;
            }
            if (param.bottomLeft && tile.bottomLeft !== param.bottomLeft) {
                return false;
            }
            return true;
        });
    }

    find(param: {topLeft?: number; topRight?: number; bottomRight?: number; bottomLeft?: number}): Tile|null
    {
        let tiles = this.findAll(param);

        return tiles.length > 0 ? tiles[0] : null;
    }

    /**
     * Returns the closes tile from this one having the same topRight, bottomRight and bottomLeft.
     * If no tile is found, returns a non existing one.
     *
     * @param topLeft
     * @param topRight
     * @param bottomRight
     * @param bottomLeft
     * @return number
     */
    getClosestTileIndex(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number): number {
        let possibleIndexes = this.findAll({
            topRight: topRight,
            bottomRight: bottomRight,
            bottomLeft: bottomLeft
        }).filter(function (tile) {
            return tile.topLeft !== topLeft;
        }).map(function (tile) {
            return tile.topLeft;
        });
        if (possibleIndexes.length === 0) {
            possibleIndexes = Tile.GROUNDS.filter(function (index) {
                return index !== topLeft;
            });
        }

        return possibleIndexes[Math.floor(Math.random() * possibleIndexes.length)];
    }
}
