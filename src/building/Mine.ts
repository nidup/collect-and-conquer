
import {Building} from "./Building";

export class Mine extends Building
{
    private remainingQuantity: number;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, quantity: number)
    {
        super(game, x, y, key, frame);
        this.remainingQuantity = quantity;

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.setCircle(28, -10, 6);

        this.inputEnabled = true;

        this.animations.add('build', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, false);
        this.animations.add('extracting', [17, 18, 19], 5, true);
        this.animations.add('idle', [17], 5, true);
        this.animations.add('destroyed', [20], 5, true);

        this.animations.play('build');

        game.add.existing(this);
    }

    public update ()
    {
        if (this.animations.currentAnim.name == "build" && this.animations.currentAnim.isFinished) {
            this.animations.play("extracting");
        }

        if (this.remainingQuantity == 0) {
            this.animations.play("idle"); // TODO: unbuild and get back the miner
        }
    }

    public isExtracting()
    {
        return this.animations.currentAnim.name == "extracting";
    }

    public getStatus()
    {
        return this.animations.currentAnim.name + ' (oil: ' + this.remainingQuantity +')';
    }

    public collect(quantity: number)
    {
        let collected = quantity;
        if (this.remainingQuantity < quantity) {
            collected = this.remainingQuantity;
            this.remainingQuantity = 0;
        } else {
            collected = quantity;
            this.remainingQuantity -= quantity;
        }

        return collected;
    }
}
