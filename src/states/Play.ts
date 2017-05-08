
import {Builder} from "../vehicle/Builder";
import {MapAnalyser} from "../ai/map/MapAnalyser";
import {Scout} from "../vehicle/Scout";
import {BotRepository} from "../vehicle/BotRepository";
import {Tank} from "../vehicle/Tank";

export default class Play extends Phaser.State {

    private bots: BotRepository;
    private map : Phaser.Tilemap;
    private layer : Phaser.TilemapLayer;
    private debug: boolean = true;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const tileSize = 20;
        const tileSpacing = 20;
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grass', 'Grass', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grass2', 'Grass2', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrasRoad', 'GrasRoad', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrassRDst', 'GrassRDst', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2CrtB', 'Grs2CrtB', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Crtc', 'Grs2Crtc', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Crtr', 'Grs2Crtr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grs2Watr', 'Grs2Watr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('Grss2Lav', 'Grss2Lav', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrssCrtr', 'GrssCrtr', tileSize, tileSize, 0, tileSpacing);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', tileSize, tileSize, 0, tileSpacing);


        const analyser = new MapAnalyser(this.map.layers[0].data, tileSize);
        const mapAnalyse = analyser.analyse();
        this.map.setCollision(mapAnalyse.getUnwalkableIndexes());

        this.layer = this.map.createLayer('Tile Layer 1');
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        this.game.physics.arcade.gravity.y = 350;

        this.bots = new BotRepository();
        this.bots.add(new Scout(this.game, 300, 300, 'Scout1', 0, this.bots));
        this.bots.add(new Scout(this.game, 50, 600, 'Scout1', 0, this.bots));
        this.bots.add(new Builder(this.game, 330, 370, 'Builder1', 0, mapAnalyse));
        //this.bots.add(new Builder(this.game, 130, 170, 'Builder1', 0));
        //this.bots.add(new Builder(this.game, 700, 370, 'Builder1', 0));
        this.bots.add(new Tank(this.game, 300, 340, 'Tank5', 0, this.bots));

        this.game.camera.follow(this.bots.get(5));
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
            this.game.debug.body(this.bots.get(2));
            this.game.debug.bodyInfo(this.bots.get(2), 20, 20);
            /*for (let i = 0; i < this.bots.length(); i++) {
                this.game.debug.body(this.bots.get(i));
            }*/

            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
