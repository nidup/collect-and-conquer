
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {MapAnalyse} from "../../ai/map/MapAnalyse";
import {PathFinder} from "../../ai/path/PathFinder";
import {PhaserPointPath} from "../../ai/path/PhaserPointPath";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./BrainText";
import {Radar} from "./sensor/Radar";

export class Builder extends Vehicle
{
    public body: Phaser.Physics.Arcade.Body;

    private radar: Radar;
    private pathfinder: PathFinder;

    private speed: number = 60;

    private path: PhaserPointPath;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, mapAnalyse: MapAnalyse, radar: Radar)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);
        this.radar = radar;

        this.pathfinder = new PathFinder(mapAnalyse);
        this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), new Phaser.Point(800, 200));

        this.brain = new StackFSM();
        this.brain.pushState(new State('path following', this.pathFollowing));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);
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
        if (this.path && this.path.lastNode() && this.getPosition().distance(this.path.lastNode()) > 20) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public wander = () =>
    {
        if (this.path == null) {
            this.behavior.wander();
            this.behavior.avoidCollision(this.radar);
            this.behavior.reactToCollision(this.body);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('path following', this.pathFollowing));
        }
    }
}
