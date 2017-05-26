
export abstract class Building extends Phaser.Sprite
{
    getPosition(): Phaser.Point
    {
        return this.body.position;
    }

    abstract getStatus() :string;
}
