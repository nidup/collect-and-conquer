
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";
import {PhaserPointPath} from "../ai/path/PhaserPointPath";
import {State} from "../ai/fsm/State";
import {BrainText} from "./BrainText";
import {ItemRepository} from "../item/ItemRepository";
import {Item} from "../item/Item";
import {PathFinder} from "../ai/path/PathFinder";
import {MapAnalyse} from "../ai/map/MapAnalyse";
import {BuildingRepository} from "../building/BuildingRepository";
import {BotRepository} from "./BotRepository";
import {Mine} from "../building/Mine";
import {Oil} from "../item/Oil";
import {Base} from "../building/Base";
import {Radar} from "./sensor/Radar";

export class Miner extends Bot
{
    private speed: number = 60;
    private scope: number = 200;
    private buildingScope: number = 40;

    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    private radar: Radar;

    private buildings: BuildingRepository;

    private oilLoad: number;
    private oilCapacity: number;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, mapAnalyse: MapAnalyse, radar: Radar, buildings: BuildingRepository)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');

        game.add.existing(this);

        this.pathfinder = new PathFinder(mapAnalyse);

        this.behavior = new SteeringComputer(this);

        this.radar = radar;

        /**
         * Wander Collect -> Go to mine -> Load -> Go to base -> Unload -> Go to mine
         * Wander Oil -> Go to oil -> Build mine (destroy)
         */
        this.brain = new StackFSM();
        this.brain.pushState(new State('wander', this.wander));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);

        this.buildings = buildings;
        this.oilLoad = 0
        this.oilCapacity = 10
    }

    public wander = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.scope);
        const mine = this.radar.closestExploitableMine(this.getPosition());
        const base = this.radar.closestBase(this.getPosition());
        const knowBaseAndMine = mine != null && base != null;
        const knowMinePlaceholder = oil != null;

        if (knowBaseAndMine) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), mine.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('go to mine', this.gotoMine));

        } else if (knowMinePlaceholder) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), oil.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('go to oil', this.gotoOil));

        } else {
            this.behavior.wander();
            this.behavior.reactToCollision(this.body);
        }
    }

    public gotoOil = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.scope);
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
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.scope);
        if (oil) {
            this.health = 0;
            const position = oil.getPosition();
            oil.collect();
            this.buildings.add(new Mine(this.game, position.x, position.y - 20, 'Mine', 0, oil.getQuantity()));

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
            this.brain.pushState(new State('goto base', this.gotoBase));
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
