
import {MapAnalyser} from "../../ai/map/MapAnalyser";
import {VehicleRepository} from "../../world/vehicle/VehicleRepository";
import {BuildingRepository} from "../../world/building/BuildingRepository";
import {MapGenerator} from "../../ai/map/generator/MapGenerator";
import {RandomMapGenerator} from "../../ai/map/generator/RandomMapGenerator";
import {CloudMapGenerator, EmptyArea} from "../../ai/map/generator/CloudMapGenerator";
import {FileMapGenerator} from "../../ai/map/generator/FileMapGenerator";
import {ItemRepository} from "../../world/item/ItemRepository";
import {Item} from "../../world/item/Item";
import {Oil} from "../../world/item/Oil";
import {Vehicle} from "../../world/vehicle/Vehicle";
import {UnitSelector} from "../../ui/UnitSelector";
import {Building} from "../../world/building/Building";
import {Player} from "../player/Player";
import {Army} from "../../world/Army";
import {MainPanel} from "../../ui/MainPanel";
import {PlayerRepository} from "../player/PlayerRepository";

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
    private mainPanel: MainPanel;

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

        const baseAreaGap = 4;
        const baseBlueX = 150;
        const baseBlueY = 150;
        const baseRedX = 850;
        const baseRedY = 650;
        const oilAreaGap = 2;
        const oil1X = 450;
        const oil1Y = 150;
        const oil2X = 850;
        const oil2Y = 150;
        const oil3X = 550;
        const oil3Y = 650;
        const oil4X = 150;
        const oil4Y = 650;
        const oil5X = 500;
        const oil5Y = 400;

        const emptyAreas = [];
        emptyAreas.push(new EmptyArea(Math.round(baseBlueX/tileSize), Math.round(baseBlueY/tileSize), baseAreaGap));
        emptyAreas.push(new EmptyArea(Math.round(baseRedX/tileSize), Math.round(baseRedY/tileSize), baseAreaGap));

        emptyAreas.push(new EmptyArea(Math.round(oil1X/tileSize), Math.round(oil1Y/tileSize), oilAreaGap));
        emptyAreas.push(new EmptyArea(Math.round(oil2X/tileSize), Math.round(oil2Y/tileSize), oilAreaGap));
        emptyAreas.push(new EmptyArea(Math.round(oil3X/tileSize), Math.round(oil3Y/tileSize), oilAreaGap));
        emptyAreas.push(new EmptyArea(Math.round(oil4X/tileSize), Math.round(oil4Y/tileSize), oilAreaGap));
        emptyAreas.push(new EmptyArea(Math.round(oil5X/tileSize), Math.round(oil5Y/tileSize), oilAreaGap));

        const mapGenerator = new CloudMapGenerator(this.game, mapWidth, mapHeight, emptyAreas);
        // const mapGenerator = new RandomMapGenerator(this.game, mapWidth, mapHeight);
        // const mapGenerator = new FileMapGenerator(this.game, mapWidth, mapHeight);
        const generatedMap = mapGenerator.generate();
        this.map = generatedMap.getTilemap();

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

        const oilQuantity = 1000;
        this.items.add(new Oil(this.game, oil1X, oil1Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(this.game, oil2X, oil2Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(this.game, oil3X, oil3Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(this.game, oil4X, oil4Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(this.game, oil5X, oil5Y, 'Icons', 0, oilQuantity));

        const players = new PlayerRepository();

        const armyBlue = new Army(0x1e85ff, this.vehicles, this.buildings, this.items, mapAnalyse, this.game);
        const humanPlayer = new Player(armyBlue, true);
        players.add(humanPlayer);

        const armyRed = new Army(0xff2b3c, this.vehicles, this.buildings, this.items, mapAnalyse, this.game)
        const botPlayer = new Player(armyRed, false);
        players.add(botPlayer);

        const base = armyBlue.buildBase(baseBlueX, baseBlueY);
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
        armyRed.recruitTank(650, 760);

        this.unitSelector = new UnitSelector();
        this.unitSelector.selectUnit(this.buildings.bases()[0]);

        this.mainPanel = new MainPanel(this.game, panelWith, this.unitSelector, players, generatedMap, this.items);
    }

    public update()
    {
        this.updateItems(this.items);
        this.updateVehicles(this.vehicles, this.game, this.layer);
        this.updateUnitSelector(this.unitSelector, this.vehicles, this.buildings, this.items);
        this.mainPanel.update();
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

        if (this.enableTileCollision) {
            const layer = collisionLayer;
            aliveVehicles.all().map(function(vehicle: Vehicle) {
                game.physics.arcade.collide(vehicle, layer);
            });
        }
    }

    // TODO: move to panel
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
