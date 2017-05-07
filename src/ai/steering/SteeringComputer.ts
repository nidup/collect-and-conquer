
import {Boid} from "./Boid";

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
    private wanderAngle: number;

    constructor (host: Boid)
    {
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
        this.wanderAngle = 0;
    }

    public seek(target: Phaser.Point, slowingRadius :number = 20) :void
    {
        const force = this.doSeek(target, slowingRadius);
        this.steering.add(force.x, force.y);
    }

    public wander() :void
    {
        const force = this.doWander();
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


    }

    public reset() :void {
        this.steering = new Phaser.Point(0, 0);
    }

    /*
    public function flee(target :Vector3D) :void {}
    public function evade(target :IBoid) :void {}
    public function pursuit(target :IBoid) :void {}


    // The internal API
    private function doFlee(target :Vector3D) :Vector3D {}
    private function doEvade(target :IBoid) :Vector3D {}
    private function doPursuit(target :IBoid) :Vector3D {}
    */

    private doSeek(target :Phaser.Point, slowingRadius :number = 0)
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

    private doWander()
    {
        const circleDistance = 50;
        const circleRadius = 50;
        const angleChange = 180;

        // Calculate the circle center
        const circleCenter = this.host.getVelocity().clone();
        circleCenter.multiply(circleDistance, circleDistance);
        circleCenter.normalize();

        // Calculate the displacement force
        const displacement = new Phaser.Point(0, -1);
        displacement.multiply(circleRadius, circleRadius);
        displacement.normalize();

        // Randomly change the vector direction by making it change its current angle
        const distance = this.host.getPosition().distance(displacement);
        displacement.x = Math.cos(this.wanderAngle) * distance;
        displacement.y = Math.sin(this.wanderAngle) * distance;

        // Change wanderAngle just a bit, so it won't have the same value in the next game frame.
        this.wanderAngle += (Math.random() * -angleChange) - (angleChange * .5);

        // Finally calculate and return the wander force
        const wanderForce = circleCenter.add(displacement.x, displacement.y);
        wanderForce.normalize();

        return wanderForce;
    }
}