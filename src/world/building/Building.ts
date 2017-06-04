
import {Army} from "../Army";
import {HealthBar} from "../common/HealthBar";

export abstract class Building extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    protected army: Army;
    protected healthBar: HealthBar;

    constructor (group: Phaser.Group, x: number, y: number, army: Army, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
    {
        super(group.game, x, y, key, frame);
        this.army = army;
        this.tint = army.getColor();
        this.maxHealth = 100;
        this.health = 100;
        this.healthBar = new HealthBar(this.game, this);
    }

    public update ()
    {
        this.healthBar.update();
    }

    destroy(destroyChildren?: boolean): void
    {
        this.healthBar.destroy();
        super.destroy(destroyChildren);
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
