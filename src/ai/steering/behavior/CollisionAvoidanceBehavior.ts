
import {Boid} from "../Boid";
import {Radar} from "../../../vehicle/sensor/Radar";
import {Generator} from "../../../building/Generator";

/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-collision-avoidance--gamedev-7777
 */
export class CollisionAvoidanceBehavior
{
    private host: Boid;

    constructor (host: Boid)
    {
        this.host = host;
    }

    public avoidCollision(radar: Radar)
    {
        const maxSeeAhead = 80;
        const maxAvoidForce = 2;

        const ahead = this.host.getPosition().clone();
        const velocity = this.host.getVelocity().clone().normalize();
        ahead.multiply(velocity.x, velocity.y);

        ahead.add(maxSeeAhead, maxSeeAhead);

        const ahead2 = ahead.clone();
        ahead2.subtract(maxSeeAhead / 2, maxSeeAhead / 2);

        let avoidance = new Phaser.Point(0, 0);
        const mostThreatening = radar.closestObstacle(this.host.getPosition(), maxSeeAhead);

        if (mostThreatening != null) {

            avoidance.x = ahead.x - mostThreatening.getPosition().x;
            avoidance.y = ahead.y - mostThreatening.getPosition().y;

            avoidance.multiply(maxAvoidForce, maxAvoidForce);
            avoidance.normalize();

            return avoidance;
        }

        return avoidance;
    }
}