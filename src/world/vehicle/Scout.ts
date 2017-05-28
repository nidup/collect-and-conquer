
import {Boid} from "../../ai/steering/Boid";
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {BotRepository} from "./BotRepository";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {State} from "../../ai/fsm/State";
import {BrainText} from "./BrainText";
import {Radar} from "./sensor/Radar";

export class Scout extends Bot
{
    private radar: Radar;
    private repository: BotRepository;

    private speed: number = 90;
    private scope: number = 100;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, bots: BotRepository, radar: Radar) {
        super(game, x, y, key, frame);

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

        this.repository = bots;
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
            // TODO: sometimes both bot and enemy does not move anymore!
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
