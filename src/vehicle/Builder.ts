
import {PathFinder} from "../ai/PathFinder";
import {Path} from "../ai/Path";
import {Position} from "../ai/Position";

export class Builder extends Phaser.Sprite
{
    private speed: number = 60;
    private pathfinder: PathFinder;
    private currentPath: Path = null;
    private target: Position = null;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number, pathfinder: PathFinder)
    {
        super(game, x, y, key, frame);

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

        this.pathfinder = pathfinder;

        game.add.existing(this);
    }

    public update ()
    {
        const position = this.getPosition();

        if (this.target && position.getX() == this.target.getX() && position.getY() == this.target.getY()) {
            this.target = this.currentPath.shift();
        }

        if (this.target) {
            let facing = '';

            if (position.getY() < this.target.getY()) {
                facing = 'bottom';
                this.body.velocity.y = this.speed;
            } else if (position.getY() > this.target.getY()) {
                facing = 'top';
                this.body.velocity.y = -this.speed;
            } else {
                this.body.velocity.y = 0;
            }

            if (position.getX() < this.target.getX()) {
                facing = (facing == '' ? '' : '-') + 'right';
                this.body.velocity.x = this.speed;
            } else if (position.getX() > this.target.getX()) {
                facing = (facing == '' ? '' : '-') + 'left';
                this.body.velocity.x = -this.speed;
            } else {
                this.body.velocity.x = 0;
            }

            this.animations.play(facing);

        } else {
            this.currentPath = null;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
        }
    }

    public changePath(targetX: number, targetY: number)
    {
        const position = this.getPosition();
        const startX = position.getX();
        const startY = position.getY();
        const endX = Math.ceil(targetX / 20) - 1;
        const endY = Math.ceil(targetY / 20) - 1;

        const path = this.pathfinder.findPath(startX, startY, endX, endY);
        if (path != null) {
            this.currentPath = path;
            this.target = this.currentPath.shift();
        }
    }

    private getPosition()
    {
        return new Position(Math.ceil(this.x / 20) - 1, Math.ceil(this.y / 20) - 1);
    }
}
