
import {Boid} from "../Boid";
import {SeekBehavior} from "./SeekBehavior";
import {PhaserPointPath} from "../../path/PhaserPointPath";

/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-path-following--gamedev-8769
 */
export class PathFollowingBehavior
{
    private host: Boid;
    private seekBehavior: SeekBehavior;
    private currentNodeIndex: number;

    constructor (host: Boid, seekBehavior: SeekBehavior)
    {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }

    public followPath(path :PhaserPointPath, slowingRadius :number = 0)
    {
        let target :Phaser.Point = null;

        if (path != null && path.getNodes().length > 0) {
            const nodes = path.getNodes();

            if (this.currentNodeIndex == null) {
                this.currentNodeIndex = 0;
            }

            target = nodes[this.currentNodeIndex];
            const distance = this.host.getPosition().distance(target);

            if (distance <= 20) {
                this.currentNodeIndex += 1;
                if (this.currentNodeIndex >= nodes.length) {
                    this.currentNodeIndex = nodes.length - 1;
                }
            }
        }

        return target != null ? this.seekBehavior.doSeek(target, slowingRadius) : new Phaser.Point(0, 0);
    }
}