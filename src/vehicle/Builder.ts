
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";
import {MapAnalyse} from "../ai/map/MapAnalyse";
import {PathFinder} from "../ai/path/PathFinder";
import {PhaserPointPath} from "../ai/path/PhaserPointPath";

export class Builder extends Phaser.Sprite implements Boid, Bot
{
    private behavior: SteeringComputer;
    private brain: StackFSM;
    private pathfinder: PathFinder;

    private speed: number = 60;

    private path: PhaserPointPath;

    private stateText: Phaser.Text;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, mapAnalyse: MapAnalyse)
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

        this.pathfinder = new PathFinder(mapAnalyse);
        this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), new Phaser.Point(800, 200));

        this.brain = new StackFSM();
        this.brain.pushState(this.pathFollowing);

        var style = {font: "carrier-command", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle"};
        this.stateText = this.game.add.text(this.x, this.y - 20, '', style);
        this.stateText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        game.physics.enable(this.stateText, Phaser.Physics.ARCADE);
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

        if (this.brain.getCurrentState() == this.wander) {
            this.stateText.setText('wander');
        } else {
            this.stateText.setText('path following');
        }

        this.game.physics.arcade.moveToXY(this.stateText, this.body.x, this.body.y -20);
    }

    // TODO: for debug purpose
    public changePath(finalDestination: Phaser.Point)
    {
        const newPath = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), finalDestination);
        if (newPath) {
            this.path = newPath;
        }
    }

    public pathFollowing = () =>
    {
        if (this.path && this.getPosition().distance(this.path.lastNode()) > 20) {
            this.behavior.pathFollowing(this.path);
            this.behavior.avoidCollision(this.body);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(this.wander);
        }
    }

    public wander = () =>
    {
        if (this.path == null) {
            this.behavior.wander();
            this.behavior.avoidCollision(this.body);
        } else {
            this.brain.popState();
            this.brain.pushState(this.pathFollowing);
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
}
