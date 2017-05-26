
export abstract class Building extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;

    getPosition(): Phaser.Point
    {
        return this.body.center;
    }

    abstract getStatus() :string;
}
