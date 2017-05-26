
export abstract class Item extends Phaser.Sprite
{
    private collected: boolean = false;

    getPosition(): Phaser.Point
    {
        return this.body.position;
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
