
import {PathFinder} from "../ai/path/PathFinder";
import {Path} from "../ai/path/Path";
import {Position} from "../ai/path/Position";
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";

export class Builder extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;
    public steeringComputer: SteeringComputer;

    private pathfinder: PathFinder;
    private currentPath: Path = null;
    private target: Position = null;
    private speed: number = 60;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, pathfinder: PathFinder)
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

        this.pathfinder = pathfinder;
        game.add.existing(this);

        this.steeringComputer = new SteeringComputer(this);
    }

    public update ()
    {
        const positionOnMap = this.getPositionOnMap();

        if (this.target && positionOnMap.getX() == this.target.getX() && positionOnMap.getY() == this.target.getY()) {

            // TODO: hack to last target
            for (let ind = this.currentPath.length(); ind > 0; ind--) {
                this.target = this.currentPath.shift();
            }
        }


        if (!this.target) {
            this.steeringComputer.wander();
            this.steeringComputer.compute();

        } else {
            const targetX = this.target.getX() * 20;
            const targetY = this.target.getY() * 20;
            const finalDestination = new Phaser.Point(targetX, targetY);

            this.steeringComputer.seek(finalDestination, 80);
            this.steeringComputer.compute();

            /*
             TODO : naive slow down does not work in steering computer
             if (this.currentPath && this.currentPath.length() < 2) {
             this.speed = this.maxSpeed - 20;
             } else {
             this.speed = this.maxSpeed;
             }*/


            if (this.position.distance(finalDestination) < 20){
                this.currentPath = null;
                this.target = null;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }
        }


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

        /*else {
            this.currentPath = null;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }*/
    }

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

    getPositionOnMap()
    {
        return new Position(Math.ceil(this.x / 20) - 1, Math.ceil(this.y / 20) - 1);
    }
}
