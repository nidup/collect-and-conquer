
import {Boid} from "../Boid";
import {SeekBehavior} from "./SeekBehavior";

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

    public doPathFollowing(finalDestination :Phaser.Point, slowingRadius :number = 0)
    {
        return this.seekBehavior.doSeek(finalDestination, slowingRadius);
    }
}