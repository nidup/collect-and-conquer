
import {Item} from "./Item";

export class Oil extends Item
{
    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.allowGravity = false;
        this.inputEnabled = true;

        this.animations.add('idle', [33], 1, true);
        this.animations.play('idle');

        game.add.existing(this);
    }
}
