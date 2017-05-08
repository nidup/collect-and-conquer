
import {Boid} from "../Boid";

export class SeekBehavior
{
    private host: Boid;

    constructor (host: Boid)
    {
        this.host = host;
    }

    public seek(target :Phaser.Point, slowingRadius :number = 0)
    {
        // direction vector is the straight direction from the boid to the target
        const direction = new Phaser.Point(target.x, target.y);
        // now we subtract the current boid position
        direction.subtract(this.host.getPosition().x, this.host.getPosition().y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        direction.normalize();

        // Check the distance to detect whether the character is inside the slowing area
        const distance = this.host.getPosition().distance(target);
        if (slowingRadius == 0 || distance > slowingRadius) {
            // time to set magnitude (length) to boid speed
            direction.setMagnitude(this.host.getMaxVelocity().x);
        } else {
            const ratio = distance / slowingRadius;
            if (ratio < 0.1) {
                direction.setMagnitude(0);
            } else {
                direction.setMagnitude(this.host.getMaxVelocity().x * ratio);
            }
        }

        // now we subtract the current boid velocity
        direction.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        direction.normalize();

        // finally we set the magnitude to boid force, which should be WAY lower than its velocity
        // TODO? direction.setMagnitude(this.force);

        return direction;
    }
}