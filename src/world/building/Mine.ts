
import {Building} from "./Building";
import {Army} from "../Army";

export class Mine extends Building
{
    private remainingQuantity: number;

    constructor(group: Phaser.Group, x: number, y: number, army: Army, key: string, frame: number, quantity: number)
    {
        super(group, x, y, army, key, frame);

        this.maxHealth = 200;
        this.health = this.maxHealth;

        this.remainingQuantity = quantity;

        this.anchor.setTo(.5,.5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setCircle(28, -10, 6);
        this.inputEnabled = true;

        this.animations.add('build', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, false);
        this.animations.add('extracting', [17, 18, 19], 5, true);
        this.animations.add('idle', [17], 5, true);
        this.animations.add('destroyed', [20], 5, true);

        this.animations.play('build');

        group.add(this);
    }

    public update ()
    {
        super.update();
        if (this.animations.currentAnim.name == "build" && this.animations.currentAnim.isFinished) {
            this.animations.play("extracting");
        }

        if (this.isDestroyed()) {
            this.animations.play("destroyed");
        } else if (this.remainingQuantity == 0) {
            this.animations.play("idle"); // TODO: unbuild and get back the miner
        }
    }

    public isExtracting()
    {
        return this.animations.currentAnim.name == "extracting";
    }

    public getStatus()
    {
        return this.animations.currentAnim.name + ' (oil: ' + this.remainingQuantity +') ';
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
