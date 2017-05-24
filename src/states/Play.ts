
import {Builder} from "../vehicle/Builder";
import {MapAnalyser} from "../ai/map/MapAnalyser";
import {Scout} from "../vehicle/Scout";
import {BotRepository} from "../vehicle/BotRepository";
import {Tank} from "../vehicle/Tank";
import {Miner} from "../vehicle/Miner";
import {BuildingRepository} from "../building/BuildingRepository";
import {Base} from "../building/Base";
import {Mine} from "../building/Mine";
import {Generator} from "../building/Generator";
import {MapGenerator} from "../map/MapGenerator";
import {RandomMapGenerator} from "../map/RandomMapGenerator";
import {FileMapGenerator} from "../map/FileMapGenerator";

export default class Play extends Phaser.State
{

    private buildings: BuildingRepository;
    private bots: BotRepository;
    private map : Phaser.Tilemap;
    private layer : Phaser.TilemapLayer;
    private debug: boolean = false;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#00ff00';
        this.game.antialias = false;

        const screenWidth = 1000;
        const screenHeight = 500;
        const tileSize = 20;

        const mapGenerator = new RandomMapGenerator(this.game, screenWidth, screenHeight);
        // const mapGenerator = new FileMapGenerator(this.game, screenWidth, screenHeight);
        this.map = mapGenerator.generate();

        const analyser = new MapAnalyser(this.map.layers[0].data, tileSize);
        const mapAnalyse = analyser.analyse();
        this.map.setCollision(mapAnalyse.getUnwalkableIndexes());

        this.game.physics.arcade.gravity.y = 350;

        this.buildings = new BuildingRepository();
        this.buildings.add(new Base(this.game, 150, 200, 'Base', 0));
        this.buildings.add(new Mine(this.game, 800, 200, 'Mine', 0));
        this.buildings.add(new Generator(this.game, 100, 200, 'Generator', 0));

        this.bots = new BotRepository();
        this.bots.add(new Scout(this.game, 300, 300, 'Scout1', 0, this.bots));
        this.bots.add(new Scout(this.game, 50, 600, 'Scout1', 0, this.bots));
        this.bots.add(new Builder(this.game, 330, 370, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Builder(this.game, 130, 170, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Builder(this.game, 700, 370, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Tank(this.game, 300, 340, 'Tank5', 0, this.bots));
        this.bots.add(new Miner(this.game, 70, 100, 'Miner', 0));

        this.game.camera.follow(this.bots.get(5));
    }

    public update()
    {
        if (this.game.input.mousePointer.isDown) {
            for (let i = 0; i < this.bots.length(); i++) {
                if (this.bots.get(i) instanceof Builder) {
                    (<Builder>this.bots.get(i)).changePath(new Phaser.Point(this.game.input.x, this.game.input.y));
                }
            }
        }

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
            //this.game.debug.body(this.bots.get(1));
            //this.game.debug.bodyInfo(this.bots.get(1), 20, 20);
            for (let i = 0; i < this.bots.length(); i++) {
                this.game.debug.body(this.bots.get(i));
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
