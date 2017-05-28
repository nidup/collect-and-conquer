
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
import {FileMapGenerator} from "../../map/FileMapGenerator";
import {ItemRepository} from "../../world/item/ItemRepository";
import {Item} from "../../world/item/Item";
import {Oil} from "../../world/item/Oil";
import {Vehicle} from "../../world/vehicle/Vehicle";
import {Radar} from "../../world/vehicle/sensor/Radar";
import {CommandPanel} from "../../ui/CommandPanel";
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

        const screenWidth = 1000;
        const screenHeight = 500;
        const tileSize = 20;

        const mapGenerator = new RandomMapGenerator(this.game, screenWidth, screenHeight);
        // const mapGenerator = new FileMapGenerator(this.game, screenWidth, screenHeight);
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
        this.players.push(new Player(armyBlue));

        const armyRed = new Army(0xff6771, this.vehicles, this.buildings, this.items, mapAnalyse, this.game);
        this.players.push(new Player(armyRed));

        this.items.add(new Oil(this.game, 370, 430, 'Icons', 0, 40));
        this.items.add(new Oil(this.game, 570, 450, 'Icons', 0, 70));
        this.items.add(new Oil(this.game, 770, 150, 'Icons', 0, 70));

        armyBlue.buildBase(150, 200);
        armyBlue.buildGenerator(400, 190);
        armyBlue.recruitMiner(70, 100);
        armyBlue.recruitMiner(100, 400);
        armyBlue.recruitMiner(400, 100);
        armyBlue.recruitMiner(700, 100);

        /*
        armyBlue.recruitScout(250, 200);
        armyBlue.recruitScout(50, 600);
        armyBlue.recruitScout(200, 400);*/
        armyBlue.recruitScout(50, 400);
        armyBlue.recruitBuilder(330, 370);
        armyBlue.recruitTank(400, 360);

        armyRed.buildBase(800, 450);
        armyRed.recruitMiner(850, 300);
        armyRed.recruitMiner(800, 400);


        this.unitSelector = new UnitSelector();
        this.unitSelector.selectUnit(this.buildings.bases()[0]);
        new CommandPanel(this.game, screenWidth, this.unitSelector);
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

        if (game.input.mousePointer.isDown) {
            aliveVehicles.all().map(function(vehicle: Vehicle) {
                if (vehicle instanceof Builder) {
                    (<Builder>vehicle).changePath(new Phaser.Point(game.input.x, game.input.y));
                }
            });
        }

        if (this.enableTileCollision) {
            const layer = collisionLayer;
            aliveVehicles.all().map(function(vehicle: Vehicle) {
                game.physics.arcade.collide(vehicle, layer);
                vehicle.update();
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
