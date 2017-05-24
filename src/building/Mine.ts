
import {Building} from "./Building";

export class Mine extends Building
{
    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number)
    {
        super(game, x, y, key, frame);

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.allowGravity = false;

        this.animations.add('build', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, false);
        this.animations.add('collecting', [17, 18, 19], 5, true);
        this.animations.add('destroyed', [20], 5, true);

        this.animations.play('build');

        game.add.existing(this);
    }

    public update ()
    {
        if (this.animations.currentAnim.name == "build" && this.animations.currentAnim.isFinished) {
            this.animations.play("collecting");
        }
    }

    public isCollecting()
    {
        return this.animations.currentAnim.name == "collecting";
    }
}
