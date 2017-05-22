
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

export class Miner extends Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private speed: number = 60;
    private scope: number = 400;

    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    // TODO: Radar class?
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private bots: BotRepository;


    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, mapAnalyse: MapAnalyse, items: ItemRepository, buildings: BuildingRepository, bots: BotRepository)
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

        this.items = items;
        this.buildings = buildings;
        this.bots = bots;

        this.brain = new StackFSM();
        this.brain.pushState(new State('wander', this.wander));

        this.brainText = new BrainText(this.game, this.x, this.y - 20, '', {}, this, this.brain);
    }

    public pathFollowing = () =>
    {
        const item = this.closestVisibleItem();
        const objectHasAlreadyBeenPicked = !item;// || this.path.lastNode() != item.getPosition();
        const hasPathAndObjectCannotBePicked = this.path && this.getPosition().distance(this.path.lastNode()) > 10;
        const hasPathAndObjectCanBePicked = this.path && this.getPosition().distance(this.path.lastNode()) < 10;
        if (objectHasAlreadyBeenPicked) {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        } else if (hasPathAndObjectCannotBePicked) {
            this.behavior.pathFollowing(this.path);
            this.behavior.reactToCollision(this.body);
        } else if (hasPathAndObjectCanBePicked) {
            this.buildMine(item);
        } else {
            this.path = null;
            this.brain.popState();
            this.brain.pushState(new State('wander', this.wander));
        }
    }


    public wander = () =>
    {
        const item = this.closestVisibleItem();
        if (item) {
            this.path = this.pathfinder.findPhaserPointPath(this.getPosition().clone(), item.getPosition().clone());
            this.brain.popState();
            this.brain.pushState(new State('path following', this.pathFollowing));
        } else {
            this.behavior.wander();
            this.behavior.reactToCollision(this.body);
        }
    }

    private closestVisibleItem(): Item|null
    {
        let closestItem = null;
        let closestDistance = this.scope * 100;
        for (let index = 0; index < this.items.length(); index++) {
            let item = this.items.get(index);
            let distance = this.getPosition().distance(this.items.get(index).getPosition());
            if (distance < this.scope && distance < closestDistance) {
                closestItem = item;
                closestDistance = distance;
            }
        }

        return closestItem;
    }

    public buildMine = (oil: Oil) =>
    {
        this.health = 0;

        const position = oil.getPosition();
        this.items.remove(oil);
        oil.destroy();

        this.buildings.add(new Mine(this.game, position.x, position.y, 'Mine', 0));
        this.bots.remove(this);
    }
}
