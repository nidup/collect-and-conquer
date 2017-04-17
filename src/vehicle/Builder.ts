
export class Builder extends Phaser.Sprite {

    private limitLeftX: number;
    private limitRightX: number;
    private distance: number = 80;
    private speed: number = 20;
    private facing: string;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number) {
        super(game, x, y, key, frame);

        this.limitLeftX = x - this.distance;
        this.limitRightX = x + this.distance;

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('top-left', [0], 10, true);
        this.animations.add('top', [1], 10, true);
        this.animations.add('top-right', [2], 10, true);
        this.animations.add('left', [3], 10, true);
        this.animations.add('right', [5], 10, true);
        this.animations.add('bottom-left', [6], 10, true);
        this.animations.add('bottom', [7], 10, true);
        this.animations.add('bottom-right', [8], 10, true);

        this.facing = 'left';

        game.add.existing(this);
    }

    public update ()
    {
        if (this.x < this.limitLeftX) {
            this.facing = 'right';
        } else if (this.x > this.limitRightX) {
            this.facing = 'left';
        }

        if (this.facing == 'left') {
            this.animations.play('top-left');
            this.body.velocity.x = -this.speed;
            this.body.velocity.y = -this.speed;

        } else if (this.facing == 'right') {
            this.animations.play('bottom-right');
            this.body.velocity.x = this.speed;
            this.body.velocity.y = this.speed;
        }
    }
}
