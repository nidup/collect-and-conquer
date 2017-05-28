
import {Building} from "./Building";
import {Army} from "../Army";

export class Generator extends Building
{
    constructor(game: Phaser.Game, x: number, y: number, army: Army, key: string, frame: number)
    {
        super(game, x, y, army, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.setCircle(28, -6, 6);
        this.inputEnabled = true;

        this.animations.add('generating', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 5, true);
        this.animations.add('destroyed', [15], 5, true);

        this.animations.play('generating');

        game.add.existing(this);
    }

    public getStatus()
    {
        return this.animations.currentAnim.name;
    }
}
