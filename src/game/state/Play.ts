
import {Builder} from "../../world/vehicle/Builder";
import {MapAnalyser} from "../../ai/map/MapAnalyser";
import {Scout} from "../../world/vehicle/Scout";
import {VehicleRepository} from "../../world/vehicle/VehicleRepository";
import {Tank} from "../../world/vehicle/Tank";
import {Miner} from "../../world/vehicle/Miner";
import {BuildingRepository} from "../../world/building/BuildingRepository";
import {Base} from "../../world/building/Base";
import {Mine} from "../../world/building/Mine";
import {Generator} from "../../world/building/Generator";
import {MapGenerator} from "../../map/MapGenerator";
import {RandomMapGenerator} from "../../map/RandomMapGenerator";
import {CloudMapGenerator} from "../../map/CloudMapGenerator";
import {FileMapGenerator} from "../../map/FileMapGenerator";
import {ItemRepository} from "../../world/item/ItemRepository";
import {Item} from "../../world/item/Item";
import {Oil} from "../../world/item/Oil";
import {Vehicle} from "../../world/vehicle/Vehicle";
import {Radar} from "../../world/vehicle/sensor/Radar";
import {ControlPanel} from "../../ui/ControlPanel";
import {UnitSelector} from "../../ui/UnitSelector";
import {Building} from "../../world/building/Building";
import {Player} from "../player/Player";
import {Army} from "../../world/Army";

export default class Play extends Phaser.State
{
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private vehicles: VehicleRepository;
    private map : Phaser.Tilemap;
    private layer : Phaser.TilemapLayer;
    private unitSelector: UnitSelector;
    private debug: boolean = false;
    private enableTileCollision = true;
    private players: Player[];

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';
        this.game.antialias = false;

        const panelWith = 240;
        const mapWidth = this.game.width - panelWith;
        const mapHeight = this.game.height;
        const tileSize = 20;

        // const mapGenerator = new CloudMapGenerator(this.game, mapWidth, mapHeight);
        const mapGenerator = new RandomMapGenerator(this.game, mapWidth, mapHeight);
        // const mapGenerator = new FileMapGenerator(this.game, mapWidth, mapHeight);
        this.map = mapGenerator.generate();

        // handle collisions
        const analyser = new MapAnalyser(this.map.layers[0].data, tileSize);
        const mapAnalyse = analyser.analyse();
        if (this.enableTileCollision) {
            this.map.setCollision(mapAnalyse.getUnwalkableIndexes());
        }

        this.layer = this.map.createLayer(MapGenerator.LAYER_NAME);
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        this.items = new ItemRepository();
        this.buildings = new BuildingRepository();
        this.vehicles = new VehicleRepository();

        this.players = [];

        const armyBlue = new Army(0x8cd6ff, this.vehicles, this.buildings, this.items, mapAnalyse, this.game);
        const humanPlayer = new Player(armyBlue);
        this.players.push(humanPlayer);

        const armyRed = new Army(0xff6771, this.vehicles, this.buildings, this.items, mapAnalyse, this.game);
        this.players.push(new Player(armyRed));

        this.items.add(new Oil(this.game, 450, 150, 'Icons', 0, 1000));
        this.items.add(new Oil(this.game, 850, 150, 'Icons', 0, 1000));
        this.items.add(new Oil(this.game, 550, 650, 'Icons', 0, 1000));
        this.items.add(new Oil(this.game, 150, 650, 'Icons', 0, 1000));
        this.items.add(new Oil(this.game, 500, 400, 'Icons', 0, 1000));

        const base = armyBlue.buildBase(150, 150);
        base.stock(400);

        /*
        armyBlue.recruitMiner(70, 100);
        armyBlue.recruitMiner(100, 400);
        armyBlue.recruitMiner(400, 100);
        armyBlue.recruitMiner(100, 600);
        armyBlue.recruitScout(250, 200);
        armyBlue.recruitScout(50, 400);
        armyBlue.recruitBuilder(330, 370);
        armyBlue.recruitTank(300, 260);
        */

        armyRed.buildBase(850, 650);
        armyRed.recruitMiner(850, 500);
        armyRed.recruitMiner(800, 600);
        armyRed.recruitMiner(700, 700);
        armyRed.recruitMiner(600, 700);
        armyRed.recruitScout(450, 800);
        armyRed.recruitScout(300, 600);
        armyRed.recruitTank(600, 760);

        this.unitSelector = new UnitSelector();
        this.unitSelector.selectUnit(this.buildings.bases()[0]);
        new ControlPanel(this.game, this.game.width,panelWith,  this.unitSelector, humanPlayer);
    }

    public update()
    {
        this.updateItems(this.items);
        this.updateVehicles(this.vehicles, this.game, this.layer);
        this.updateUnitSelector(this.unitSelector, this.vehicles, this.buildings, this.items);
    }

    private updateItems(items: ItemRepository)
    {
        const collectableItems = items;
        collectableItems.all()
            .filter(function(item: Item) {
                return item.hasBeenCollected();
            })
            .map(function(item: Item) {
                collectableItems.remove(item);
                item.destroy();
            });
    }

    private updateVehicles(vehicles: VehicleRepository, game: Phaser.Game, collisionLayer: Phaser.TilemapLayer)
    {
        const aliveVehicles = vehicles;
        aliveVehicles.all()
            .filter(function (vehicle: Vehicle) {
                return !vehicle.isAlive();
            })
            .map(function (vehicle: Vehicle) {
                aliveVehicles.remove(vehicle);
                vehicle.destroy();
            });

        /*
        if (game.input.mousePointer.isDown) {
            aliveVehicles.all().map(function(vehicle: Vehicle) {
                if (vehicle instanceof Builder) {
                    (<Builder>vehicle).changePath(new Phaser.Point(game.input.x, game.input.y));
                }
            });
        }*/

        if (this.enableTileCollision) {
            const layer = collisionLayer;
            aliveVehicles.all().map(function(vehicle: Vehicle) {
                game.physics.arcade.collide(vehicle, layer);
            });
        }
    }

    private updateUnitSelector(unitSelector: UnitSelector, vehicles: VehicleRepository, buildings: BuildingRepository, items: ItemRepository)
    {
        unitSelector.listenVehicles(vehicles.all());
        unitSelector.listenBuildings(buildings.all());
        unitSelector.listenItems(items.all());
    }

    public render()
    {
        if (this.debug) {
            // TODO: try https://github.com/samme/phaser-plugin-debug-arcade-physics ?
            // this.game.debug.body(this.vehicles.get(1));
            // this.game.debug.bodyInfo(this.vehicles.get(1), 240, 410);
            const game = this.game;
            this.vehicles.all().map(function(vehicle: Vehicle) {
                game.debug.body(vehicle);
            });
            this.buildings.all().map(function(building: Building) {
                game.debug.body(building);
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
