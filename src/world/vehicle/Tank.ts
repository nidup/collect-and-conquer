
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {Army} from "../Army";
import {Camera} from "./sensor/Camera";
import {Radar} from "./sensor/Radar";
import {PathFinder} from "../../ai/path/PathFinder";
import {TankDefendBrain} from "./brain/TankDefendBrain";
import Physics = Phaser.Physics;
import {TankAttackBrain} from "./brain/TankAttackBrain";
import {BrainText} from "./info/BrainText";
import {Map} from "../../ai/map/Map";
import {Building} from "../building/Building";

export class Tank extends Vehicle
{
    protected attackScope: number;
    protected attackDamage: number;
    protected weapon: Phaser.Weapon;
    private brainAttack: TankAttackBrain;
    private brainDefend: TankDefendBrain;

    constructor(group: Phaser.Group, x: number, y: number, army: Army, radar: Radar, camera: Camera, key: string, frame: number, map: Map)
    {
        super(group, x, y, army, radar, camera, key, frame);

        this.maxHealth = 150;
        this.health = this.maxHealth;
        this.maxVelocity = 40;
        this.attackScope = 100;
        this.attackDamage = 8;

        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        group.add(this);

        this.behavior = new SteeringComputer(this);

        this.weapon = group.game.add.weapon(-1, 'Bullet', 14);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 500;
        this.weapon.trackSprite(this, 0, 0, true);

        this.brainAttack = new TankAttackBrain(this, new PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainDefend = new TankDefendBrain(this, new PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));

        this.brain = this.brainDefend;
        this.brainText = new BrainText(group, this.x, this.y, '', {}, this, this.brain);
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

    public attackVehicle(enemy: Vehicle)
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

    public attackBuilding(enemy: Building)
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

    public getSteeringComputer(): SteeringComputer
    {
        return this.behavior;
    }

    public getBody(): Physics.Arcade.Body
    {
        return this.body;
    }

    public getAttackScope(): number
    {
        return this.attackScope;
    }
}
