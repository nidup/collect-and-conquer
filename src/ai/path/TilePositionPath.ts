
import {TilePosition} from "./TilePosition";

/**
 * Path of TilePosition
 */
export class TilePositionPath {

    private nodes: Array<TilePosition>;

    constructor (rawPositions)
    {
        this.nodes = [];
        for (let i = 0; i < rawPositions.length; i++) {
            this.nodes[i] = new TilePosition(rawPositions[i].x, rawPositions[i].y)

        }
    }

    public shift() :TilePosition
    {
        if (this.nodes.length > 0) {
            return this.nodes.shift();
        }

        return null;
    }

    public length() : number
    {
        return this.nodes.length;
    }

    public getNodes() : Array<TilePosition>
    {
        return this.nodes;
    }
}
