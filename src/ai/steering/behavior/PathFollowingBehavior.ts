
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

    constructor (host: Boid, seekBehavior: SeekBehavior)
    {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }

    public doPathFollowing(path :PhaserPointPath, slowingRadius :number = 0)
    {
        const finalDestination = path.getNodes()[path.getNodes().length-1];

        return this.seekBehavior.doSeek(finalDestination, slowingRadius);
    }
}