
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {BotRepository} from "./BotRepository";

export class Scout extends Phaser.Sprite implements Boid, Bot
{
    private repository: BotRepository;
    public body: Phaser.Physics.Arcade.Body;
    public steeringComputer: SteeringComputer;
    private speed: number = 90;
    private scope: number = 100;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, bots: BotRepository)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.repository = bots;
        this.steeringComputer = new SteeringComputer(this);
    }

    private target: Phaser.Point = new Phaser.Point(600, 450);
    private state: string = 'seek';

    public update ()
    {
        if (this.state === 'flee') {
            const enemies = this.repository.enemiesOf(this);
            for (let index = 0; index < enemies.length; index++) {
                let enemy = this.repository.get(index);
                if (this.getPosition().distance(enemy.getPosition()) < this.scope) {
                    this.steeringComputer.flee(enemy.getPosition());
                }
            }
        }

        if (this.state === 'wander') {
            this.steeringComputer.wander();
        }

        if (this.state === 'seek') {
            this.steeringComputer.seek(this.target, 150);
        }

        this.steeringComputer.compute();

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
