
import {Boid} from "../../ai/steering/Boid";
import {SteeringComputer} from "../../ai/steering/SteeringComputer";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {BrainText} from "./BrainText";
import {Army} from "../Army";

export abstract class Vehicle extends Phaser.Sprite implements Boid
{
    public body: Phaser.Physics.Arcade.Body;
    protected army: Army;
    protected behavior: SteeringComputer;
    protected brain: StackFSM;
    protected brainText: BrainText;

    constructor (game: Phaser.Game, x: number, y: number, army: Army, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
    {
        super(game, x, y, key, frame);
        this.army = army;
        this.tint = army.getColor();
    }

    public update ()
    {
        this.brain.update();
        this.behavior.compute();
        this.updateAngle();
        this.brainText.update();
    }

    public isAlive() :boolean
    {
        return this.health > 0;
    }

    public getStatus() :string
    {
        return this.brain.getCurrentState().getName();
    }

    destroy(destroyChildren?: boolean): void
    {
        this.brainText.destroy();
        super.destroy(destroyChildren);
    }

    updateAngle()
    {
        this.angle = 180 + Phaser.Math.radToDeg(
            Phaser.Point.angle(
                this.getPosition(),
                new Phaser.Point(
                    this.getPosition().x + this.getVelocity().x,
                    this.getPosition().y + this.getVelocity().y
                )
            )
        );
    }

    getVelocity(): Phaser.Point
    {
        return this.body.velocity;
    }

    getMaxVelocity(): Phaser.Point
    {
        return this.body.maxVelocity;
    }

    getPosition(): Phaser.Point
    {
        return this.body.center;
    }

    getMass(): number {
        return this.body.mass;
    }
}