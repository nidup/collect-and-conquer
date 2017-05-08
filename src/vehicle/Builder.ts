
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";

export class Builder extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private behavior: SteeringComputer;
    private brain: StackFSM;

    private speed: number = 60;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number)
    {
        super(game, x, y, key, frame);

        // TODO: offset to compensate the path finding coordinates

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);
        this.brain = new StackFSM();
        this.brain.pushState(this.pathFollowing);
    }

    public update ()
    {

        /*
         if (this.state === 'seek') {
         this.behavior.seek(this.target, 150);
         }*/

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
/*
    public changePath(targetX: number, targetY: number)
    {
        const position = this.getPositionOnMap();
        const startX = position.getX();
        const startY = position.getY();
        const endX = Math.ceil(targetX / 20) - 1;
        const endY = Math.ceil(targetY / 20) - 1;

        const path = this.pathfinder.findPath(startX, startY, endX, endY);
        if (path != null) {
            this.currentPath = path;
            this.target = this.currentPath.shift();
        }
    }*/

    /*
     getPositionOnMap()
     {
     return new Position(Math.ceil(this.x / 20) - 1, Math.ceil(this.y / 20) - 1);
     }*/

    public pathFollowing = () =>
    {
/*        if (this.path == null) {

        }*/

        //this.behavior.pathFollowing(new Phaser.Point(800, 300));
    }

    public wander = () =>
    {
        this.behavior.wander();
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
