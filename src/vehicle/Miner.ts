
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
    public body: Phaser.Physics.Arcade.Body;

    private speed: number = 60;
    private scope: number = 200;

    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    private radar: Radar;

    private buildings: BuildingRepository;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, mapAnalyse: MapAnalyse, radar: Radar, buildings: BuildingRepository)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');

        game.add.existing(this);

        this.pathfinder = new PathFinder(mapAnalyse);

        this.behavior = new SteeringComputer(this);

        this.radar = radar;

        this.brain = new StackFSM();
        this.brain.pushState(new State('wander', this.wander));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);

        // TODO how to remove / replace for the new mine building? a factory?
        this.buildings = buildings;
    }

    public pathFollowing = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.scope);
        const lookForOilPosition = !oil;
        const canGoToMinePlaceholder = this.path && this.getPosition().distance(this.path.lastNode()) > 10;
        const canBuildMine = this.path && this.getPosition().distance(this.path.lastNode()) < 10;
        if (lookForOilPosition) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        } else if (canGoToMinePlaceholder) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else if (canBuildMine) {
            this.buildMine(oil);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }

    public wander = () =>
    {
        const oil = this.radar.closestVisibleOil(this.getPosition(), this.scope);
        const mine = this.radar.closestExploitableMine(this.getPosition());
        const base = this.radar.closestBase(this.getPosition());
        const knowBaseAndMine = mine != null && base != null;
        const knowMinePlaceholder = oil != null;

        if (knowBaseAndMine) {
            this.path = this.pathfinder.findPhaserPointPath(mine.getPosition().clone(), base.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('collecting', this.collecting));

        } else if (knowMinePlaceholder) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), oil.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('path following', this.pathFollowing));

        } else {
            this.behavior.wander();
            this.behavior.reactToCollision(this.body);
        }
    }

    public collecting = () =>
    {
        this.behavior.pathPatrolling(this.path);
        this.behavior.reactToCollision(this.body);
    }

    public buildMine = (oil: Oil) =>
    {
        this.health = 0;

        const position = oil.getPosition();
        oil.collect();

        this.buildings.add(new Mine(this.game, position.x, position.y, 'Mine', 0));
    }
}
