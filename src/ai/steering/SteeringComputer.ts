
import {Boid} from "./Boid";
import {SeekBehavior} from "./behavior/SeekBehavior";
import {WanderBehavior} from "./behavior/WanderBehavior";
import {FleeBehavior} from "./behavior/FleeBehavior";

/**
 * Inspired by following posts
 *
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-movement-manager--gamedev-4278
 * @see http://www.emanueleferonato.com/2016/02/01/understanding-steering-behavior-html5-example-using-phaser/
 */
export class SteeringComputer
{
    private steering : Phaser.Point;
    private host : Boid;
    private seekBehavior: SeekBehavior;
    private wanderBehavior: WanderBehavior;
    private fleeBehavior: FleeBehavior;

    constructor(host: Boid)
    {
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
        this.seekBehavior = new SeekBehavior(host);
        this.wanderBehavior = new WanderBehavior(host);
        this.fleeBehavior = new FleeBehavior(host);
    }

    public seek(target: Phaser.Point, slowingRadius :number = 20) :void
    {
        const force = this.seekBehavior.doSeek(target, slowingRadius);
        this.steering.add(force.x, force.y);
    }

    public wander() :void
    {
        const force = this.wanderBehavior.doWander();
        this.steering.add(force.x, force.y);
    }

    public flee(target: Phaser.Point) :void
    {
        const force = this.fleeBehavior.doFlee(target);
        this.steering.add(force.x, force.y);
    }

    public compute() :void
    {
        // Now we add boid direction to current boid velocity
        this.host.getVelocity().add(this.steering.x, this.steering.y);
        // we normalize the velocity
        this.host.getVelocity().normalize();
        // we set the magnitude to boid speed
        this.host.getVelocity().setMagnitude(this.host.getMaxVelocity().x);
        // TODO: fix the slow down, break the rest
        //this.host.getVelocity().setMagnitude(this.steering.getMagnitude());
    }

    public reset() :void {
        this.steering = new Phaser.Point(0, 0);
    }
}