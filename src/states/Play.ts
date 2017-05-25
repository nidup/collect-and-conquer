
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
import {ItemRepository} from "../item/ItemRepository";
import {Item} from "../item/Item";
import {Oil} from "../item/Oil";
import {Bot} from "../vehicle/Bot";
import {Radar} from "../vehicle/sensor/Radar";

export default class Play extends Phaser.State
{
    private items: ItemRepository;
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

        this.items = new ItemRepository();
        this.items.add(new Oil(this.game, 370, 430, 'Icons', 0));
        this.items.add(new Oil(this.game, 570, 430, 'Icons', 0));

        this.buildings = new BuildingRepository();
        this.buildings.add(new Base(this.game, 150, 200, 'Base', 0));
        this.buildings.add(new Generator(this.game, 400, 190, 'Generator', 0));

        const radar = new Radar(this.items, this.buildings, this.bots);

        this.bots = new BotRepository();
        this.bots.add(new Scout(this.game, 300, 300, 'Scout1', 0, this.bots));
        this.bots.add(new Scout(this.game, 50, 600, 'Scout1', 0, this.bots));
        this.bots.add(new Builder(this.game, 330, 370, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Builder(this.game, 130, 170, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Builder(this.game, 700, 370, 'Builder1', 0, mapAnalyse));
        this.bots.add(new Tank(this.game, 400, 360, 'Tank5', 0, this.bots));
        this.bots.add(new Miner(this.game, 70, 100, 'Miner', 0, mapAnalyse, radar, this.buildings));
        this.bots.add(new Miner(this.game, 100, 400, 'Miner', 0, mapAnalyse, radar, this.buildings));
        this.bots.add(new Miner(this.game, 400, 100, 'Miner', 0, mapAnalyse, radar, this.buildings));

        //TODO this.game.camera.follow(this.bots.get(5));
    }

    public update()
    {
        const collectableItems = this.items;
        collectableItems.all()
            .filter(function(item: Item) {
                return item.hasBeenCollected();
            })
            .map(function(item: Item) {
                collectableItems.remove(item);
                item.destroy();
            });

        const aliveBots = this.bots;
        aliveBots.all()
            .filter(function (bot: Bot) {
                return !bot.isAlive();
            })
            .map(function (bot: Bot) {
                aliveBots.remove(bot);
                bot.destroy();
            });

        if (this.game.input.mousePointer.isDown) {
            const game = this.game;
            aliveBots.all().map(function(bot: Bot) {
                if (bot instanceof Builder) {
                    (<Builder>bot).changePath(new Phaser.Point(game.input.x, game.input.y));
                }
            });
        }

        const game = this.game;
        const layer = this.layer;
        aliveBots.all().map(function(bot: Bot) {
            game.physics.arcade.collide(bot, layer);
            bot.update();
        });
    }

    public render()
    {
        if (this.debug) {
            // TODO: try https://github.com/samme/phaser-plugin-debug-arcade-physics ?
            this.game.debug.body(this.bots.get(1));
            this.game.debug.bodyInfo(this.bots.get(1), 240, 20);
            const game = this.game;
            this.bots.all().map(function(bot: Bot) {
                game.debug.body(bot);
            });

            this.items.all().map(function(item: Item) {
                game.debug.body(item);
            });

            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
