
import {Boid} from "../Boid";

export class SeekBehavior
{
    private host: Boid;

    constructor (host: Boid)
    {
        this.host = host;
    }

    public doSeek(target :Phaser.Point, slowingRadius :number = 0)
    {
        // direction vector is the straight direction from the boid to the target
        const direction = new Phaser.Point(target.x, target.y);
        // now we subtract the current boid position
        direction.subtract(this.host.getPosition().x, this.host.getPosition().y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        direction.normalize();

        // time to set magnitude (length) to boid speed
        direction.setMagnitude(this.host.getMaxVelocity().x);
        // now we subtract the current boid velocity
        direction.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        direction.normalize();

        // finally we set the magnitude to boid force, which should be WAY lower than its velocity
        // TODO? direction.setMagnitude(this.force);

        // slows down when approaching from target TODO: does not work.
        /*
         const distance = this.host.getPosition().distance(target);
         if (distance <= slowingRadius) {
         direction.multiply(
         this.host.getMaxVelocity().x * distance / slowingRadius,
         this.host.getMaxVelocity().x * distance / slowingRadius,
         );
         } else {
         direction.multiply(this.host.getMaxVelocity().x, this.host.getMaxVelocity().y);
         }*/

        return direction;
    }
}