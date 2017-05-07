
import {Boid} from "./Boid";
import {Builder} from "../../vehicle/Builder";

export class SteeringComputer
{
    private steering : Phaser.Point;
    private host : Boid;

    constructor (host: Boid)
    {
        // TODO: temporary
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
    }

    public seek(target: Phaser.Point, slowingRadius :number = 20) :void
    {
        // direction vector is the straight direction from the boid to the target
        const direction = new Phaser.Point(target.x, target.y);
        // now we subtract the current boid position
        direction.subtract((<Builder>this.host).x, (<Builder>this.host).y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        direction.normalize();
        // time to set magnitude (length) to boid speed
        direction.setMagnitude((<Builder>this.host).speed);
        // now we subtract the current boid velocity
        direction.subtract((<Builder>this.host).body.velocity.x, (<Builder>this.host).body.velocity.y);
        // normalizing again
        direction.normalize();

        // finally we set the magnitude to boid force, which should be WAY lower than its velocity
//            direction.setMagnitude(this.force);
        // Now we add boid direction to current boid velocity
        (<Builder>this.host).body.velocity.add(direction.x, direction.y);
        // we normalize the velocity
        (<Builder>this.host).body.velocity.normalize();
        // we set the magnitue to boid speed
        (<Builder>this.host).body.velocity.setMagnitude((<Builder>this.host).speed);
        (<Builder>this.host).angle = 180 + Phaser.Math.radToDeg(
                Phaser.Point.angle(
                    (<Builder>this.host).position,
                    new Phaser.Point(
                        (<Builder>this.host).x + (<Builder>this.host).body.velocity.x,
                        (<Builder>this.host).y + (<Builder>this.host).body.velocity.y
                    )
                )
            );
    }

    public apply() :void
    {

    }

    public reset() :void {
        this.steering = new Phaser.Point(0, 0);
    }

    /*
    public function flee(target :Vector3D) :void {}
    public function wander() :void {}
    public function evade(target :IBoid) :void {}
    public function pursuit(target :IBoid) :void {}


    // The update method.
    // Should be called after all behaviors have been invoked


    // The internal API
    private function doSeek(target :Vector3D, slowingRadius :Number = 0) :Vector3D {}
    private function doFlee(target :Vector3D) :Vector3D {}
    private function doWander() :Vector3D {}
    private function doEvade(target :IBoid) :Vector3D {}
    private function doPursuit(target :IBoid) :Vector3D {}
    */
}