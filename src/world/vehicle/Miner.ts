
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {PathFinder} from "../../ai/path/PathFinder";
import {Camera} from "./sensor/Camera";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";
import {MinerCollectBrain} from "./brain/MinerCollectBrain";
import {Oil} from "../item/Oil";
import {Mine} from "../building/Mine";
import {Base} from "../building/Base";
import Physics = Phaser.Physics;
import {BrainText} from "./info/BrainText";
import {Map} from "../../ai/map/Map";

export class Miner extends Vehicle
{
    private buildingScope: number = 40;
    private oilLoad: number;
    private oilCapacity: number;

    constructor(group: Phaser.Group, x: number, y: number, army: Army, radar: Radar, camera: Camera, key: string, frame: number, map: Map)
    {
        super(group.game, x, y, army, radar, camera, key, frame);

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxVelocity = 60;

        this.anchor.setTo(.5,.5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;

        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');

        group.add(this);

        this.behavior = new SteeringComputer(this);

        this.oilLoad = 0
        this.oilCapacity = 10

        this.brain = new MinerCollectBrain(this, new PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainText = new BrainText(group, this.x, this.y, '', {}, this, this.brain);
    }

    public buildMine(oil: Oil)
    {
        this.health = 0;
        const position = oil.getPosition();
        oil.collect();
        this.army.buildMine(position.x, position.y - 20, oil);
    }

    public loadOil(exploitableMine: Mine)
    {
        const expectedQuantity = this.oilCapacity - this.oilLoad;
        const collectedQuantity = exploitableMine.collect(expectedQuantity);
        this.oilLoad = collectedQuantity;
    }

    public unloadOil(base: Base)
    {
        base.stock(this.oilLoad);
        this.oilLoad = 0;
    }

    public getBuildingScope(): number
    {
        return this.buildingScope;
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
