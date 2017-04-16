
export class Snake extends Phaser.Sprite {

    private limitLeftX: number;
    private limitRightX: number;
    private distance: number = 30;
    private speed: number = 30;
    private facing: string;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number) {
        super(game, x, y, key, frame);

        this.limitLeftX = x - this.distance;
        this.limitRightX = x + this.distance;

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.bounce.y = 0.2;
        this.body.collideWorldBounds = true;
        this.body.setSize(18, 16, 8, 16);
        this.animations.add('left', [23, 24, 25, 26], 10, true);
        this.animations.add('right', [0, 1, 2, 3], 10, true);

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
            this.animations.play('left');
            this.body.velocity.x = -this.speed;

        } else if (this.facing == 'right') {
            this.animations.play('right');
            this.body.velocity.x = this.speed;
        }
    }
}
