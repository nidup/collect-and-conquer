
import {Position} from "./Position";

export class Path {

    private points: Array<Position>;

    constructor (nodes)
    {
        this.points = [];
        for (let i = 0; i < nodes.length; i++) {
            this.points[i] = new Position(nodes[i].x, nodes[i].y)

        }
    }

    public shift()
    {
        if (this.points.length > 0) {
            return this.points.shift();
        }

        return null;
    }
}
