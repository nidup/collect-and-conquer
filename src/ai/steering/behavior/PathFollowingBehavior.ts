
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
    private currentPath: PhaserPointPath;

    constructor (host: Boid, seekBehavior: SeekBehavior)
    {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }

    public followPath(path :PhaserPointPath, slowingRadius :number = 0)
    {
        this.resetIfPathHasChanged(path);

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

        return target != null ? this.seekBehavior.seek(target, slowingRadius) : new Phaser.Point(0, 0);
    }

    private resetIfPathHasChanged(path :PhaserPointPath)
    {
        if (this.currentPath != path) {
            this.currentPath = path;
            this.currentNodeIndex = 0;
        }
    }
}