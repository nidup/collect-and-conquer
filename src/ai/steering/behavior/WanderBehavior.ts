
import {Boid} from "../Boid";

export class WanderBehavior
{
    private host: Boid;
    private wanderAngle: number;

    constructor (host: Boid)
    {
        this.host = host;
        this.wanderAngle = 0;
    }

    public doWander()
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