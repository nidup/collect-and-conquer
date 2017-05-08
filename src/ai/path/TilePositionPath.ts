
import {TilePosition} from "./TilePosition";

/**
 * Path of TilePosition
 */
export class TilePositionPath {

    private nodes: Array<TilePosition>;

    constructor (nodes)
    {
        this.nodes = [];
        for (let i = 0; i < nodes.length; i++) {
            this.nodes[i] = new TilePosition(nodes[i].x, nodes[i].y)

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
}
