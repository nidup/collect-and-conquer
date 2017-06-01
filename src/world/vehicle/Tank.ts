
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {Army} from "../Army";
import {Radar} from "./sensor/Radar";
import {PathFinder} from "../../ai/path/PathFinder";
import {MapAnalyse} from "../../ai/map/MapAnalyse";
import {TankDefendBrain} from "./brain/TankDefendBrain";
import Physics = Phaser.Physics;
import {TankAttackBrain} from "./brain/TankAttackBrain";
import {BrainText} from "./info/BrainText";

export class Tank extends Vehicle
{
    protected attackScope: number;
    protected attackDamage: number;
    protected weapon: Phaser.Weapon;
    private brainAttack: TankAttackBrain;
    private brainDefend: TankDefendBrain;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number, mapAnalyse: MapAnalyse)
    {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 150;
        this.health = this.maxHealth;
        this.maxVelocity = 40;
        this.attackScope = 100;
        this.attackDamage = 8;

        this.anchor.setTo(.5, .5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);

        this.weapon = game.add.weapon(30, 'Bullet', 14);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 500;
        this.weapon.trackSprite(this, 0, 0, true);

        this.brainAttack = new TankAttackBrain(this);
        this.brainDefend = new TankDefendBrain(this, new PathFinder(mapAnalyse));

        this.brain = this.brainDefend;
        this.brainText = new BrainText(this.game, this.x, this.y, '', {}, this, this.brain);
    }

    public update ()
    {
        if (this.army.getStrategy().isAttacking()) {
            this.brain = this.brainAttack;
            this.brainText.changeBrain(this.brain);
        } else if (this.army.getStrategy().isDefending()) {
            this.brain = this.brainDefend;
            this.brainText.changeBrain(this.brain);
        }
        super.update();
    }

    public attack(enemy: Vehicle)
    {
        const distance = this.getPosition().distance(enemy.getPosition());
        if (distance <= this.attackScope) {

            const attackDamage = this.attackDamage;
            const bullets = this.weapon.bullets;

            this.game.physics.arcade.collide(
                bullets,
                enemy,
                function (touchedEnemy, firedBullet) {
                    touchedEnemy.hit(attackDamage);
                    firedBullet.destroy();
                }
            );
            this.weapon.fireAtSprite(enemy)
        }
    }

    public getVisibilityScope()
    {
        return this.visibilityScope;
    }

    public getRadar(): Radar
    {
        return this.radar;
    }

    public getSteeringComputer(): SteeringComputer
    {
        return this.behavior;
    }

    public getBody(): Physics.Arcade.Body
    {
        return this.body;
    }
}
