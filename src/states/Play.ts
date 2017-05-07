
import {Builder} from "../vehicle/Builder";
import {PathFinder} from "../ai/path/PathFinder";
import {MapAnalyser} from "../ai/map/MapAnalyser";
import {Scout} from "../vehicle/Scout";
import {BotRepository} from "../vehicle/BotRepository";

export default class Play extends Phaser.State {

    private bots: BotRepository;
    private map : Phaser.Tilemap;
    private layer : Phaser.TilemapLayer;
    private debug: boolean = false;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 20);
        this.map.addTilesetImage('Grass', 'Grass', 20, 20, 0, 20);
        this.map.addTilesetImage('Grass2', 'Grass2', 20, 20, 0, 20);
        this.map.addTilesetImage('GrasRoad', 'GrasRoad', 20, 20, 0, 20);
        this.map.addTilesetImage('GrassRDst', 'GrassRDst', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2CrtB', 'Grs2CrtB', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Crtc', 'Grs2Crtc', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Crtr', 'Grs2Crtr', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Watr', 'Grs2Watr', 20, 20, 0, 20);
        this.map.addTilesetImage('Grss2Lav', 'Grss2Lav', 20, 20, 0, 20);
        this.map.addTilesetImage('GrssCrtr', 'GrssCrtr', 20, 20, 0, 20);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 20);

        const analyser = new MapAnalyser();
        const analyse = analyser.analyse();

        this.map.setCollision(analyse.getUnwalkableIndexes());

        this.layer = this.map.createLayer('Tile Layer 1');
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        const pathfinder = new PathFinder(this.map, analyse.getWalkableIndexes());

        this.game.physics.arcade.gravity.y = 350;

        this.bots = new BotRepository();
        this.bots.add(new Builder(this.game, 330, 370, 'Builder1', 0, pathfinder));
        this.bots.add(new Builder(this.game, 130, 170, 'Builder1', 0, pathfinder));
        this.bots.add(new Builder(this.game, 700, 370, 'Builder1', 0, pathfinder));
        this.bots.add(new Scout(this.game, 300, 300, 'Scout1', 0, this.bots));

        this.game.camera.follow(this.bots.first());
    }

    public update()
    {
        /*
        if (this.game.input.mousePointer.isDown) {
            for (let i = 0; i < this.vehicles.length; i++) {
//                this.vehicles[i].changePath(this.game.input.x, this.game.input.y);
            }
        }*/

        for (let i = 0; i < this.bots.length(); i++) {
            this.game.physics.arcade.collide(this.bots.get(i), this.layer); // TODO: vehicles block easily when moving
            this.bots.get(i).update();
            // TODO: handle vehicles collisions
            //this.game.physics.arcade.overlap(this.hero, this.vehicles[i], this.bite, null, this);
        }
    }

    public render()
    {
        if (this.debug) {
            // TODO: try https://github.com/samme/phaser-plugin-debug-arcade-physics ?
            this.game.debug.body(this.bots.first());
            this.game.debug.bodyInfo(this.bots.first(), 20, 20);
            for (let i = 0; i < this.bots.length(); i++) {
                this.game.debug.body(this.bots.first());
            }

            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
