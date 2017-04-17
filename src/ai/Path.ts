
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

    public length () {
        return this.points.length;
    }

    public get(index) {
        return this.points[index];
    }
}
