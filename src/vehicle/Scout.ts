
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {BotRepository} from "./BotRepository";
import {StackFSM} from "../ai/fsm/StackFSM";

export class Scout extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private repository: BotRepository;
    private behavior: SteeringComputer;
    private brain: StackFSM;

    private speed: number = 90;
    private scope: number = 100;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, bots: BotRepository) {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5, .5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.repository = bots;
        this.behavior = new SteeringComputer(this);
        this.brain = new StackFSM();
        this.brain.pushState(this.wander);
    }

    private target: Phaser.Point = new Phaser.Point(600, 450);

    public update ()
    {
        this.brain.update();

        /*
        if (this.state === 'seek') {
            this.behavior.seek(this.target, 150);
        }*/


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

    public wander = () =>
    {
        const enemy = this.closeToEnemy();
        if (enemy !== null) {
            this.brain.pushState(this.flee);

        } else {
            this.behavior.wander();
        }
    }

    public flee = () =>
    {
        const enemy = this.closeToEnemy();
        if (enemy !== null) {
            this.behavior.flee(enemy.getPosition());
        } else {
            this.brain.popState();
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

    private closeToEnemy(): Bot|null
    {
        const enemies = this.repository.enemiesOf(this);
        for (let index = 0; index < enemies.length; index++) {
            let enemy = enemies[index];
            if (this.getPosition().distance(enemy.getPosition()) < this.scope) {
                return enemy;
            }
        }

        return null;
    }
}
