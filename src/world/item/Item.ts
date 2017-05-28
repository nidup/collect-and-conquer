
export abstract class Item extends Phaser.Sprite
{
    public body: Phaser.Physics.Arcade.Body;
    private collected: boolean = false;

    getPosition(): Phaser.Point
    {
        return this.body.center;
    }

    collect(): void
    {
        this.collected = true;
    }

    hasBeenCollected(): boolean
    {
        return this.collected;
    }

    abstract getStatus(): string;
}
