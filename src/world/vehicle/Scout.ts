
import {Boid} from "../../ai/steering/Boid";
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {VehicleRepository} from "./VehicleRepository";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./BrainText";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";

export class Scout extends Vehicle
{
    private radar: Radar;
    private repository: VehicleRepository;

    private speed: number = 90;
    private scope: number = 100;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, key: string, frame: number, vehicles: VehicleRepository, radar: Radar) {
        super(game, x, y, army, key, frame);

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

        this.repository = vehicles;
        this.radar = radar;
        this.behavior = new SteeringComputer(this);
        this.brain = new StackFSM();
        this.brain.pushState(new State('wander', this.wander));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);
    }

    public wander = () =>
    {
        const enemy = this.closestEnemy();
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
        const enemy = this.closestEnemy();
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

    private closestEnemy(): Boid|null
    {
        const enemies = this.repository.enemiesOf(this);
        let closestEnemy = null;
        let closestDistance = this.scope * 10;
        for (let index = 0; index < enemies.length; index++) {
            let enemy = enemies[index];
            let distance = this.getPosition().distance(enemies[index].getPosition());
            if (distance < this.scope && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        return <Boid>closestEnemy;
    }
}
