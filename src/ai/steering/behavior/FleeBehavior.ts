
import {Boid} from "../Boid";

export class FleeBehavior
{
    private host: Boid;

    constructor (host: Boid)
    {
        this.host = host;
    }

    /**
     * Almost like the SeekBehavior excepts that the vector goes from the target to the boid (to flee away!)
     * @param target
     * @returns {Phaser.Point}
     */
    public flee(target :Phaser.Point)
    {
        // direction vector is the straight direction from the target to the boid
        const force = new Phaser.Point(this.host.getPosition().x, this.host.getPosition().y);
        // now we subtract the target position
        force.subtract(target.x, target.y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        force.normalize();

        // time to set magnitude (length) to boid speed
        force.setMagnitude(this.host.getMaxVelocity().x);
        // now we subtract the current boid velocity
        force.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        force.normalize();

        return force;
    }
}