
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {BotRepository} from "./BotRepository";
import {StackFSM} from "../ai/fsm/StackFSM";

export class Tank extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private repository: BotRepository;
    private behavior: SteeringComputer;
    private brain: StackFSM;

    private speed: number = 50;
    private scope: number = 200;

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
    }

    public wander = () =>
    {
        const enemy = this.closestEnemy();
        if (enemy !== null) {
            this.brain.pushState(this.pursuing);
        } else {
            this.behavior.wander();
        }
    }

    public pursuing = () =>
    {
        const enemy = this.closestEnemy();
        if (enemy !== null) {
            this.behavior.pursuing(enemy);
        } else {
            this.brain.popState();
            console.log('back to wander');
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
