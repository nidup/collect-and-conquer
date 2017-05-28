
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./BrainText";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";

export class Scout extends Vehicle
{
    private speed: number = 90;
    private visibilityScope: number = 100;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number) {
        super(game, x, y, army, radar, key, frame);

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

        this.behavior = new SteeringComputer(this);
        this.brain = new StackFSM();
        this.brain.pushState(new State('wander', this.wander));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);
    }

    public wander = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            this.brain.pushState(new State('evading', this.evading));

        } else {
            this.behavior.wander();
            this.behavior.avoidCollision(this.radar);
            this.behavior.reactToCollision(this.body);
        }
    }

    public evading = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            // TODO: flee makes something more natural when pursuing!
            // TODO: sometimes both vehicle and enemy does not move anymore!
            //this.behavior.evading(enemy);
            this.behavior.flee(enemy.getPosition());
            this.behavior.avoidCollision(this.radar);
        } else {
            this.brain.popState();
        }
    }
}