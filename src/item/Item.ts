
export abstract class Item extends Phaser.Sprite
{
    getPosition(): Phaser.Point
    {
        return this.body.position;
    }
}
