
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";
import {PhaserPointPath} from "../ai/path/PhaserPointPath";

export class Miner extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private behavior: SteeringComputer;
    private brain: StackFSM;

    private speed: number = 60;

    private path: PhaserPointPath;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);

        this.path = new PhaserPointPath(
            [
                this.getPosition().clone(),
                new Phaser.Point(400, 200),
                new Phaser.Point(400, 400),
                new Phaser.Point(200, 400)
            ]);

        this.brain = new StackFSM();
        this.brain.pushState(this.pathPatrolling);
    }

    public update ()
    {
        this.brain.update();

        this.behavior.compute();

        // TODO: could be put back in steering computer?
        this.angle = 180 + Phaser.Math.radToDeg(
                Phaser.Point.angle(
                    this.getPosition(),
                    new Phaser.Point(
                        this.getPosition().x + this.getVelocity().x,
                        this.getPosition().y + this.getVelocity().y
                    )
                )
            );
    }

    public pathPatrolling = () =>
    {
        if (this.path) {
            this.behavior.pathPatrolling(this.path);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(this.wander);
        }
    }

    public wander = () =>
    {
        this.behavior.wander();
        this.behavior.reactCollision(this.body);
    }

    getVelocity(): Phaser.Point {
        return this.body.velocity;
    }

    getMaxVelocity(): Phaser.Point {
        return this.body.maxVelocity;
    }

    getPosition(): Phaser.Point
    {
        return this.body.position;
    }

    getMass(): number {
        return this.body.mass;
    }
}
