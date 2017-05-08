
import {Boid} from "../Boid";

export class CollisionReactionBehavior
{
    private host: Boid;
    private wanderAngle: number;

    constructor (host: Boid)
    {
        this.host = host;
        this.wanderAngle = 0;
    }

    public reactCollision(body: Phaser.Physics.Arcade.Body)
    {
        const avoidForce = new Phaser.Point(0, 0);
        const force = 20;

        if (body.blocked.up) {
            avoidForce.add(0, force);
        }
        if (body.blocked.down) {
            avoidForce.add(0, -force);
        }
        if (body.blocked.left) {
            avoidForce.add(force, 0);
        }
        if (body.blocked.right) {
            avoidForce.add(-force, 0);
        }

        return avoidForce;
    }
}