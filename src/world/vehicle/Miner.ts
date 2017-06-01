
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {PathFinder} from "../../ai/path/PathFinder";
import {MapAnalyse} from "../../ai/map/MapAnalyse";;
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";
import {MinerCollectBrain} from "./brain/MinerCollectBrain";
import {Oil} from "../item/Oil";
import {Mine} from "../building/Mine";
import {Base} from "../building/Base";
import Physics = Phaser.Physics;

export class Miner extends Vehicle
{
    private buildingScope: number = 40;
    private oilLoad: number;
    private oilCapacity: number;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, key: string, frame: number, mapAnalyse: MapAnalyse)
    {
        super(game, x, y, army, radar, key, frame);

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxVelocity = 60;

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

        this.behavior = new SteeringComputer(this);

        this.oilLoad = 0
        this.oilCapacity = 10

        this.brain = new MinerCollectBrain(this, new PathFinder(mapAnalyse));
    }

    // TODO: to drop!!
    public update ()
    {
        this.brain.think();
        this.behavior.compute();
        this.updateAngle();
        this.healthBar.update();
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

    public getVisibilityScope(): number
    {
        return this.visibilityScope;
    }

    public getBuildingScope(): number
    {
        return this.buildingScope;
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
