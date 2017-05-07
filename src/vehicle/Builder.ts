
import {PathFinder} from "../ai/path/PathFinder";
import {Path} from "../ai/path/Path";
import {Position} from "../ai/path/Position";
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";

export class Builder extends Phaser.Sprite implements Boid
{
    public body: Phaser.Physics.Arcade.Body;

    public steeringComputer: SteeringComputer;

    private pathfinder: PathFinder;
    private currentPath: Path = null;
    private target: Position = null;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, pathfinder: PathFinder)
    {
        super(game, x, y, key, frame);

        // TODO: offset to compensate the path finding coordinates

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(60, 60);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('top-left', [0], 10, true);
        this.animations.add('top', [1], 10, true);
        this.animations.add('top-right', [2], 10, true);
        this.animations.add('left', [3], 10, true);
        this.animations.add('right', [5], 10, true);
        this.animations.add('bottom-left', [6], 10, true);
        this.animations.add('bottom', [7], 10, true);
        this.animations.add('bottom-right', [8], 10, true);

        this.pathfinder = pathfinder;

        // TODO: not need of facing if sprite is rotating
        this.animations.play('left');

        game.add.existing(this);

        this.steeringComputer = new SteeringComputer(this);
    }

    public update ()
    {
        const position = this.getPositionOnMap();

        /*
        TODO : naive slow down
        if (this.currentPath && this.currentPath.length() < 2) {
            this.speed = this.maxSpeed - 20;
        } else {
            this.speed = this.maxSpeed;
        }*/

        if (this.target && position.getX() == this.target.getX() && position.getY() == this.target.getY()) {

            // TODO: hack to last target
            for (let ind = this.currentPath.length(); ind > 0; ind--) {
                this.target = this.currentPath.shift();
            }
        }

        if (this.target) {
            let facing = '';

            if (position.getY() < this.target.getY()) {
                facing = 'bottom';
//                this.body.velocity.y = this.speed;
            } else if (position.getY() > this.target.getY()) {
                facing = 'top';
//                this.body.velocity.y = -this.speed;
            } else {
//                this.body.velocity.y = 0;
            }

            if (position.getX() < this.target.getX()) {
                facing = (facing == '' ? '' : facing + '-') + 'right';
//                this.body.velocity.x = this.speed;
            } else if (position.getX() > this.target.getX()) {
                facing = (facing == '' ? '' : facing + '-') + 'left';
//                this.body.velocity.x = -this.speed;
            } else {
//                this.body.velocity.x = 0;
            }

//            this.animations.play(facing);


            const targetX = this.target.getX() * 20;
            const targetY = this.target.getY() * 20;
            const finalDestination = new Phaser.Point(targetX, targetY);


            this.steeringComputer.seek(finalDestination);
            this.steeringComputer.compute();

            if(this.position.distance(finalDestination) < 20){

                this.currentPath = null;
                this.target = null;
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                //target.x = game.rnd.between(10, game.width - 10);
                //target.y = game.rnd.between(10, game.height - 10);
            }


        } else {
            this.currentPath = null;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
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
