
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {PathFinder} from "../../ai/path/PathFinder";
import {BrainText} from "./info/BrainText";
import {Camera} from "./sensor/Camera";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";
import {BuilderDefendBrain} from "./brain/BuilderDefendBrain";
import Physics = Phaser.Physics;
import {Map} from "../../ai/map/Map";

export class Builder extends Vehicle
{
    public body: Phaser.Physics.Arcade.Body;

    constructor(game: Phaser.Game, x: number, y: number, army: Army, radar: Radar, camera: Camera, key: string, frame: number, map: Map)
    {
        super(game, x, y, army, radar, camera, key, frame);

        this.maxHealth = 80;
        this.health = this.maxHealth;
        this.maxVelocity = 60;

        this.anchor.setTo(.5,.5);
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

        this.brain = new BuilderDefendBrain(this, new PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainText = new BrainText(this.game, this.x, this.y, '', {}, this, this.brain);
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
