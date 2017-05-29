
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {PhaserPointPath} from "../../ai/path/PhaserPointPath";
import {State} from "../../ai/fsm/State";
import {PathFinder} from "../../ai/path/PathFinder";
import {MapAnalyse} from "../../ai/map/MapAnalyse";;
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";

export class Miner extends Vehicle
{
    private buildingScope: number = 40;

    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    private oilLoad: number;
    private oilCapacity: number;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number, mapAnalyse: MapAnalyse)
    {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxVelocity = 60;
        this.cost = 100;

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');

        game.add.existing(this);

        this.pathfinder = new PathFinder(mapAnalyse);

        this.behavior = new SteeringComputer(this);

        /**
         * Wander Collect -> Go to mine -> Load -> Go to base -> Unload -> Go to mine
         * Wander Oil -> Go to oil -> Build mine (destroy)
         */
        this.brain.pushState(new State('wander', this.wander));

        this.oilLoad = 0
        this.oilCapacity = 10
    }

    public wander = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.visibilityScope);
        const mine = this.radar.closestExploitableMine(this.getPosition());
        const base = this.radar.closestBase(this.getPosition());
        const knowBaseAndMine = mine != null && base != null;
        const knowMinePlaceholder = oil != null;

        if (knowBaseAndMine) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), mine.getPosition().clone());
            if (this.path) {
                this.brain.popState();
                this.brain.pushState(new State('go to mine', this.gotoMine));
            }
        } else if (knowMinePlaceholder) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), oil.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('go to oil', this.gotoOil));

        } else {
            this.behavior.wander();
            this.behavior.reactToCollision(this.body);
            this.behavior.avoidCollision(this.radar);
        }
    }

    public gotoOil = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.visibilityScope);
        const lookForOilPosition = !oil;
        const canGoToMinePlaceholder = this.path && this.getPosition().distance(this.path.lastNode()) > this.buildingScope;
        const canBuildMine = this.path && this.getPosition().distance(this.path.lastNode()) < this.buildingScope;
        if (lookForOilPosition) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        } else if (canGoToMinePlaceholder) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else if (canBuildMine) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('build mine', this.buildMine));
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public buildMine = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.visibilityScope);
        if (oil) {
            this.health = 0;
            const position = oil.getPosition();
            oil.collect();
            this.army.buildMine(position.x, position.y - 20, oil);
            this.brain.popState();
            this.brain.pushState(new State('extracting', this.extracting));
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public extracting = () =>
    {
        // IDLE : TODO: unbuild the mine?
    }

    public gotoMine = () =>
    {
        // TODO: change path is a closer is built?

        const exploitableMine = this.radar.closestExploitableMine(this.getPosition());
        const canLoadOil = this.path && this.getPosition().distance(this.path.lastNode()) < this.buildingScope;

        if (!exploitableMine) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        } else if (!canLoadOil) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('load oil', this.loadOil));
        }
    }

    public loadOil = () =>
    {
        const exploitableMine = this.radar.closestExploitableMine(this.getPosition());

        if (exploitableMine) {
            const expectedQuantity = this.oilCapacity - this.oilLoad;
            const collectedQuantity = exploitableMine.collect(expectedQuantity);
            this.oilLoad = collectedQuantity;

            const base = this.radar.closestBase(this.getPosition());
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), base.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('go to base', this.gotoBase));
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public gotoBase = () =>
    {
        const canUnloadOil = this.path && this.getPosition().distance(this.path.lastNode()) < this.buildingScope;
        if (!canUnloadOil) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('unload oil', this.unloadOil));
        }
    }

    public unloadOil = () =>
    {
        const base = this.radar.closestBase(this.getPosition());
        base.stock(this.oilLoad);
        this.oilLoad = 0;

        const exploitableMine = this.radar.closestExploitableMine(this.getPosition());
        if (exploitableMine) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), exploitableMine.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('go to mine', this.gotoMine));
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }
}
