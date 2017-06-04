
import {Item} from "./Item";

export class Oil extends Item
{
    private quantity: number;

    constructor(group: Phaser.Group, x: number, y: number, key: string, frame: number, quantity: number)
    {
        super(group.game, x, y, key, frame);

        this.quantity = quantity;

        this.anchor.setTo(.5,.5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.setCircle(5, 5, 5);
        this.inputEnabled = true;

        this.animations.add('idle', [33], 1, true);
        this.animations.play('idle');

        group.add(this);
    }

    public getQuantity(): number
    {
        return this.quantity;
    }

    public getStatus(): string
    {
        return (this.hasBeenCollected() ? 'collected' : 'to collect') + ' (oil:'+this.quantity+')';
    }
}
