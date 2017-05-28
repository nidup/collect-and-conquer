
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./info/BrainText";
import {PhaserPointPath} from "../../ai/path/PhaserPointPath";
import {Army} from "../Army";
import {Radar} from "./sensor/Radar";

export class Tank extends Vehicle
{
    private speed: number = 50;
    private visibilityScope: number = 200;

    private path: PhaserPointPath;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number) {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 150;
        this.heal(this.maxHealth);

        this.anchor.setTo(.5, .5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.path = new PhaserPointPath(
            [
                this.getPosition().clone(),
                new Phaser.Point(600, 470),
                new Phaser.Point(830, 200),
                new Phaser.Point(400, 200)
            ]);

        this.behavior = new SteeringComputer(this);
        this.brain.pushState(new State('patrolling', this.pathPatrolling));
    }

    public pathPatrolling = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            this.brain.popState();
            this.brain.pushState(new State('pursuing', this.pursuing));
        } else if (this.path) {
            this.behavior.pathPatrolling(this.path);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public wander = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            this.brain.pushState(new State('pursuing', this.pursuing));
        } else {
            this.behavior.wander();
        }
    }

    public pursuing = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            this.behavior.pursuing(enemy);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }
}
