
import {Army} from "../Army";

export abstract class Building extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    protected army: Army;

    constructor (game: Phaser.Game, x: number, y: number, army: Army, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
    {
        super(game, x, y, key, frame);
        this.army = army;
    }

    getPosition(): Phaser.Point
    {
        return this.body.center;
    }

    abstract getStatus() :string;
}
