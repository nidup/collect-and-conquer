
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {BrainText} from "./info/BrainText";
import {Camera} from "./sensor/Camera";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";
import {ScoutExploreBrain} from "./brain/ScoutExploreBrain";
import Physics = Phaser.Physics;

export class Scout extends Vehicle
{
    constructor(group: Phaser.Group, x: number, y: number, army: Army, radar: Radar, camera: Camera, key: string, frame: number)
    {
        super(group, x, y, army, radar, camera, key, frame);

        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.maxVelocity = 90;

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
        this.brain = new ScoutExploreBrain(this);
        this.brainText = new BrainText(group, this.x, this.y, '', {}, this, this.brain);
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
