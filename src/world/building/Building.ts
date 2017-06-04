
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
        this.healthBar = new HealthBar(group, this);
    }

    public update ()
    {
        this.healthBar.update();
    }

    public isDestroyed() :boolean
    {
        return this.health <= 20;
    }

    public hit(damage: number)
    {
        this.damage(damage)
        if (!this.isDestroyed()) {
            const hitSprite = this.game.add.sprite(this.x, this.y, 'MediumExplosion');
            hitSprite.animations.add('hit');
            hitSprite.animations.play('hit', 20, false, true);
        } else {
            const dieSprite = this.game.add.sprite(this.x - this.width / 4, this.y - this.height / 4, 'BigExplosion');
            dieSprite.animations.add('die');
            dieSprite.animations.play('die', 20, false, true);
        }
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
