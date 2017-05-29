
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {State} from "../../ai/fsm/State";
import {PhaserPointPath} from "../../ai/path/PhaserPointPath";
import {Army} from "../Army";
import {Radar} from "./sensor/Radar";
import {Miner} from "./Miner";
import {PathFinder} from "../../ai/path/PathFinder";
import {MapAnalyse} from "../../ai/map/MapAnalyse";
import Weapon = Phaser.Weapon;

export class Tank extends Vehicle
{
    private pathfinder: PathFinder;
    private path: PhaserPointPath;
    protected attackScope: number;
    protected attackDamage: number;
    protected weapon: Weapon;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number, mapAnalyse: MapAnalyse) {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 150;
        this.health = this.maxHealth;
        this.maxVelocity = 40;
        this.attackScope = 100;
        this.attackDamage = 8;
        this.cost = 180;

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

        this.pathfinder = new PathFinder(mapAnalyse);

        this.behavior = new SteeringComputer(this);

        this.weapon = game.add.weapon(30, 'Bullet', 14);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 500;
        this.weapon.trackSprite(this, 0, 0, true);

        /**
         * Wander Attack -> Pursuing + Attack
         * Wander Defend Unit (no Mine) -> escorting Miner
         * Wander Defend Mine -> patrol Mine to Base
         */
        this.brain.pushState(new State('wander', this.wander));
    }

    public wander = () =>
    {
        const visibleEnemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        const closestMiner = this.radar.closestTeamate(this.getPosition().clone(), Miner);
        const closestMine = this.radar.closestExploitableMine(this.getPosition());
        const closestBase = this.radar.closestBase(this.getPosition());
        if (visibleEnemy) {
            this.brain.popState();
            this.brain.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine) {
            this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
            this.brain.pushState(new State('protect mine', this.protectingMine));
        } else if (closestMiner) {
            this.brain.pushState(new State('escorting', this.escortingMiner));
        } else {
            this.behavior.wander();
            this.behavior.avoidCollision(this.radar);
            this.behavior.reactToCollision(this.body);
        }
    }

    public escortingMiner = () =>
    {
        const visibleEnemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        const closestMiner = this.radar.closestTeamate(this.getPosition().clone(), Miner);
        const closestBase = this.radar.closestBase(this.getPosition());
        const closestMine = this.radar.closestExploitableMine(this.getPosition());
        if (visibleEnemy) {
            this.brain.popState();
            this.brain.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine) {
            this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('protect mine', this.protectingMine));
        } else if (closestMiner !== null) {
            this.behavior.pursuing(closestMiner);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public protectingMine = () =>
    {
        const visibleEnemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        const closestMine = this.radar.closestExploitableMine(this.getPosition());
        if (visibleEnemy) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine && this.path) {
            this.behavior.pathPatrolling(this.path);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public attackEnemy = () =>
    {
        const enemy = this.radar.closestVisibleEnemy(this.getPosition().clone(), this.visibilityScope);
        if (enemy !== null) {
            this.behavior.pursuing(enemy);
            this.attack(enemy);
        } else {
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
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
}
