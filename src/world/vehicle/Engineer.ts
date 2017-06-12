
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {Vehicle} from "./Vehicle";
import {PathFinder} from "../../ai/path/PathFinder";
import {BrainText} from "./info/BrainText";
import {Camera} from "./sensor/Camera";
import {Radar} from "./sensor/Radar";
import {Army} from "../Army";
import {EngineerDefendBrain} from "./brain/EngineerDefendBrain";
import Physics = Phaser.Physics;
import {Map} from "../../ai/map/Map";
import {Building} from "../building/Building";

export class Engineer extends Vehicle
{
    public body: Phaser.Physics.Arcade.Body;
    private repairScope: number;
    private repairRythm: number;

    constructor(group: Phaser.Group, x: number, y: number, army: Army, radar: Radar, camera: Camera, key: string, frame: number, map: Map)
    {
        super(group, x, y, army, radar, camera, key, frame);

        this.maxHealth = 80;
        this.health = this.maxHealth;
        this.maxVelocity = 60;
        this.repairScope = 30;
        this.repairRythm = 1;

        this.anchor.setTo(.5,.5);
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

        this.brain = new EngineerDefendBrain(this, new PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainText = new BrainText(group, this.x, this.y, '', {}, this, this.brain);
    }


    public repairVehicle(friend: Vehicle)
    {
        if (friend.isHurted()) {
            this.repairSprite(friend);
        }
    }

    public repairBuilding(friend: Building)
    {
        if (friend.isDamaged()) {
            this.repairSprite(friend);
        }
    }

    private repairSprite(sprite: Phaser.Sprite)
    {
        const distance = this.getPosition().distance(sprite.position);
        if (distance <= this.repairScope) {
            const repairRythm = this.repairRythm;
            const damages = sprite.maxHealth - sprite.health;
            const toRepair = damages > repairRythm ? repairRythm : damages;
            sprite.heal(toRepair);
        }
    }

    public getRepairScope(): number
    {
        return this.repairScope;
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
