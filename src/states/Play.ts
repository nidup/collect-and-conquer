
import {Builder} from "../vehicle/Builder";
import {PathFinder} from "../ai/PathFinder";

export default class Play extends Phaser.State {

    private vehicles: Array<Builder>;
    private map : Phaser.Tilemap;
    private layer : Phaser.TilemapLayer;
    private debug: boolean = true;
    private briefingText : Phaser.BitmapText;

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


        let unwalkable = [
            1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15, // grass hills
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 44, 45, // grass brown rocks
            // 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70
            // 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96,
            // 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, // grass brown rocks
            112, 113, 114, 116, 118, 120, 121, 122, 125, 126, 129, 130, // grass brown rocks
            147, 148, 149, 150, 152, 153, 154, 155, 157, 158, 160, 161 // grass water
        ];
        let walkable = [5]; // TODO : to complete programmatically with intersect

        this.map.setCollision(unwalkable);

        this.layer = this.map.createLayer('Tile Layer 1');
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        const pathfinder = new PathFinder(this.map, walkable);

        this.briefingText = this.game.add.bitmapText(40, 40, 'carrier-command','Hello world!', 10);
        this.briefingText.fixedToCamera = true;

        this.game.physics.arcade.gravity.y = 350;

        this.vehicles = new Array();
        this.vehicles[0] = new Builder(this.game, 330, 370, 'Builder1', 0, pathfinder);
        //this.vehicles[1] = new Builder(this.game, 130, 170, 'Builder1', 0, pathfinder);
        //this.vehicles[2] = new Builder(this.game, 700, 370, 'Builder1', 0, pathfinder);

        this.game.camera.follow(this.vehicles[0]);
    }

    public update()
    {
        if (this.game.input.mousePointer.isDown) {
            for (let i = 0; i < this.vehicles.length; i++) {
                this.vehicles[i].changePath(this.game.input.x, this.game.input.y);
            }
        }

        for (let i = 0; i < this.vehicles.length; i++) {
            // this.game.physics.arcade.collide(this.vehicles[i], this.layer); TODO: vehicles block easily when moving
            this.vehicles[i].update();
            //this.game.physics.arcade.overlap(this.hero, this.vehicles[i], this.bite, null, this);
        }
    }

    public render()
    {
        if (this.debug) {
            this.game.debug.body(this.vehicles[0]);
            for (let i = 0; i < this.vehicles.length; i++) {
                this.game.debug.body(this.vehicles[i]);
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
