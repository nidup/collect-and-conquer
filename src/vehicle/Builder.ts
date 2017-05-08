
import {Boid} from "../ai/steering/Boid";
import {SteeringComputer} from "../ai/steering/SteeringComputer";
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";
import {MapAnalyser} from "../ai/map/MapAnalyser";
import {TilePosition} from "../ai/path/TilePosition";
import {PathFinder} from "../ai/path/PathFinder";

export class Builder extends Phaser.Sprite implements Boid, Bot
{
    public body: Phaser.Physics.Arcade.Body;

    private behavior: SteeringComputer;
    private brain: StackFSM;

    private speed: number = 60;

    constructor(game: Phaser.Game, x: number, y: number, key: string, frame: number)
    {
        super(game, x, y, key, frame);

        // TODO: offset to compensate the path finding coordinates

        this.anchor.setTo(.5,.5);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.maxVelocity.set(this.speed, this.speed);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);

        this.animations.add('right', [5], 10, true);
        this.animations.play('right');

        game.add.existing(this);

        this.behavior = new SteeringComputer(this);
        this.brain = new StackFSM();
        this.brain.pushState(this.pathFollowing);


        const analyser = new MapAnalyser();
        const analyse = analyser.analyse();
        const mapData = (<Phaser.TilemapLayer>this.game.world.children[0]).map.layers[0].data;

        const pathfinder = new PathFinder(mapData, analyse.getWalkableIndexes());
        const path = pathfinder.findTilePositionPath(new TilePosition(16, 18), new TilePosition(39, 14));
        console.log(path);

        const pointpath = pathfinder.findPhaserPointPath(new Phaser.Point(330, 370), new Phaser.Point(800, 300));
        console.log(pointpath);
    }

    public update ()
    {

        /*
         if (this.state === 'seek') {
         this.behavior.seek(this.target, 150);
         }*/

        this.brain.update();

        this.behavior.compute();

        // TODO: could be put back in steering computer?
        this.angle = 180 + Phaser.Math.radToDeg(
                Phaser.Point.angle(
                    this.getPosition(),
                    new Phaser.Point(
                        this.getPosition().x + this.getVelocity().x,
                        this.getPosition().y + this.getVelocity().y
                    )
                )
            );
    }

    public pathFollowing = () =>
    {

        //this.behavior.pathFollowing(new Phaser.Point(800, 300));
    }

    public wander = () =>
    {
        this.behavior.wander();
    }

    getVelocity(): Phaser.Point {
        return this.body.velocity;
    }

    getMaxVelocity(): Phaser.Point {
        return this.body.maxVelocity;
    }

    getPosition(): Phaser.Point
    {
        return this.body.position;
    }

    getMass(): number {
        return this.body.mass;
    }
}
