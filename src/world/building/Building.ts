
import {Army} from "../Army";

export abstract class Building extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    protected army: Army;

    constructor (game: Phaser.Game, x: number, y: number, army: Army, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
    {
        super(game, x, y, key, frame);
        this.army = army;
        this.tint = army.getColor();
    }

    getPosition(): Phaser.Point
    {
        return this.body.center;
    }

    public getArmy() :Army
    {
        return this.army;
    }

    abstract getStatus() :string;
}