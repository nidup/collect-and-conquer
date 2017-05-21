
import {Boid} from "../Boid";

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

    public avoidCollision()
    {
        const maxSeeAhead = 100;
        const maxAvoidForce = 100;

        const ahead = this.host.getPosition().clone();
        const velocity = this.host.getVelocity().clone().normalize();
        ahead.add(velocity.x, velocity.y);
        ahead.add(maxSeeAhead, maxSeeAhead); // TODO: multiply maxSeeAhead

        const ahead2 = ahead.clone();
        ahead2.subtract(maxSeeAhead / 2, maxSeeAhead / 2); // TODO: multiply maxSeeAhead multiply 0.5

        let avoidance = new Phaser.Point(0, 0);
        const mostThreatening = this.findMostThreateningObstacle();

        if (mostThreatening != null) {
            avoidance.x = ahead.x - mostThreatening.center.x;
            avoidance.y = ahead.y - mostThreatening.center.y;

            avoidance.normalize();
            avoidance.add(maxAvoidForce, maxAvoidForce); // TODO: scale by

            return avoidance;
        }

        return avoidance;
    }

    private findMostThreateningObstacle() {

        var mostThreatening = null;

        /*
        for (var i:int = 0; i < Game.instance.obstacles.length; i++) {
            var obstacle :Obstacle = Game.instance.obstacles[i];
            var collision :Boolean = lineIntersecsCircle(ahead, ahead2, obstacle);

            // "position" is the character's current position
            if (collision && (mostThreatening == null || distance(position, obstacle) < distance(position, mostThreatening))) {
                mostThreatening = obstacle;
            }
        }*/

        return mostThreatening;
    }

}