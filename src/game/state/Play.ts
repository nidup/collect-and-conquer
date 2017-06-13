
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
import {FogOfWar} from "../../ai/map/FogOfWar";
import {JukeBox} from "../../world/audio/JukeBox";
import {DialogSystem} from "../../ui/DialogSystem";

export default class Play extends Phaser.State
{
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private vehicles: VehicleRepository;
    private collisionLayer : Phaser.TilemapLayer;
    private unitSelector: UnitSelector;
    private debug: boolean = false;
    private mainPanel: MainPanel;
    private players: PlayerRepository;
    private fogOfWar: FogOfWar;
    private enableFog: boolean = true;
    private enableRandMap: boolean = true;
    private tiles: Array<Array<Phaser.Tile>>;
    private bitmap: Phaser.BitmapData;
    private dialogSystem: DialogSystem;
    private jukebox: JukeBox;
    private tick: number;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        const groundLayer = this.game.add.group();
        groundLayer.name = 'Ground';
        const unitLayer = this.game.add.group();
        unitLayer.name = 'Unit';
        const fogOfWarLayer = this.game.add.group();
        fogOfWarLayer.name = 'Fog';
        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';

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


        if (!this.enableRandMap) {
            this.game.rnd.state('!rnd,1,0.7121938972268254,0.2891752696596086,0.2457362802233547');

            // nice map !rnd,1,0.5805144435726106,0.15749581600539386,0.11405682656913996
            // this.game.rnd.state('!rnd,1,0.9783369363285601,0.5553183087613434,0.5118793193250895');
            // this.game.rnd.state('!rnd,1,0.369288211222738,0.9462695836555213,0.9028305942192674');
            // cool for collision debug this.game.rnd.state('!rnd,1,0.7287226526532322,0.30570402508601546,0.26226503564976156')
        }

        console.log(this.game.rnd.state());
        const mapGenerator = new CloudMapGenerator(groundLayer, mapWidth, mapHeight, tileSize, emptyAreas, this.game.rnd);
        // const mapGenerator = new RandomMapGenerator(groundLayer, mapWidth, mapHeight, tileSize);
        // const mapGenerator = new FileMapGenerator(groundLayer, mapWidth, mapHeight, tileSize);
        const generatedMap = mapGenerator.generate();
        this.tiles = generatedMap.getTiles();

        this.collisionLayer = generatedMap.getCollisionLayer();
        if (this.debug) {
            this.collisionLayer.debug = true;
        }
        this.collisionLayer.resizeWorld();

        this.items = new ItemRepository();
        this.buildings = new BuildingRepository();
        this.vehicles = new VehicleRepository();

        const oilQuantity = 1000;
        this.items.add(new Oil(unitLayer, oil1X, oil1Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(unitLayer, oil2X, oil2Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(unitLayer, oil3X, oil3Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(unitLayer, oil4X, oil4Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil(unitLayer, oil5X, oil5Y, 'Icons', 0, oilQuantity));

        this.players = new PlayerRepository();

        this.jukebox = new JukeBox(this.game);

        const armyBlue = new Army(0x1e85ff, this.vehicles, this.buildings, this.items, generatedMap, unitLayer, this.jukebox);
        const humanPlayer = new Player(armyBlue, true);
        this.players.add(humanPlayer);

        const armyRed = new Army(0xff2b3c, this.vehicles, this.buildings, this.items, generatedMap, unitLayer, this.jukebox);
        const botPlayer = new Player(armyRed, false);
        this.players.add(botPlayer);

        const base = armyBlue.buildBase(baseBlueX, baseBlueY);
        base.stock(400);

        /*
        armyBlue.recruitMiner(70, 100);
        armyBlue.recruitMiner(100, 400);
        armyBlue.recruitMiner(400, 100);
        armyBlue.recruitMiner(100, 600);
        armyBlue.recruitScout(250, 200);
        armyBlue.recruitScout(50, 400);
        armyBlue.recruitEngineer(330, 370);
        armyBlue.recruitTank(300, 260);
        */
        /*
        armyBlue.recruitTank(300, 260);
        armyBlue.recruitTank(350, 260);
        armyBlue.recruitTank(370, 260);
        */

        armyRed.buildBase(850, 650);
        armyRed.recruitMiner(850, 500);
        armyRed.recruitMiner(800, 600);
        armyRed.recruitMiner(700, 700);
        armyRed.recruitMiner(600, 700);
        armyRed.recruitScout(450, 800);
        armyRed.recruitScout(300, 600);
        armyRed.recruitTank(650, 760);

        // armyRed.recruitTank(250, 260);
        // armyRed.getStrategy().attack();

        this.unitSelector = new UnitSelector(humanPlayer);
        this.unitSelector.selectUnit(this.buildings.bases()[0]);
        this.mainPanel = new MainPanel(interfaceLayer, panelWith, this.unitSelector, this.players, generatedMap, this.items, this.jukebox);
        this.dialogSystem = new DialogSystem(interfaceLayer);

        this.fogOfWar = new FogOfWar();
        const fogX = 0;
        const fogY = 0;
        this.bitmap = this.game.make.bitmapData(52, 40);

        const imageFogOFWar = this.game.add.image(fogX, fogY, this.bitmap, 0, fogOfWarLayer);
        imageFogOFWar.anchor.set(0, 0);
        imageFogOFWar.scale.set(generatedMap.getTileSize(), generatedMap.getTileSize());
        fogOfWarLayer.add(imageFogOFWar);

        if (this.enableFog) {
            const knownTiles = this.players.human().getArmy().getSharedMemory().getKnownTiles();
            this.fogOfWar.apply(this.bitmap, knownTiles);
        }

        this.dialogSystem.displayNewGameDialog();
    }

    public update()
    {
        const tickGap = 500;
        if (this.tick == null) {
            this.tick = this.game.time.time + tickGap;
        }

        if (this.tick < this.game.time.time) {
            this.tick = this.game.time.time + tickGap;

            this.updateGame();
            this.updateItems(this.items);
            this.updateVehicles(this.vehicles, this.game, this.collisionLayer);
            this.updateUnitSelector(this.unitSelector, this.vehicles, this.buildings, this.items);
            this.mainPanel.update();
            if (this.enableFog) {
                const knownTiles = this.players.human().getArmy().getSharedMemory().getKnownTiles();
                this.fogOfWar.apply(this.bitmap, knownTiles);
            }
        }
    }

    private updateGame()
    {
        if (this.players.human().isDefeated()) {
            this.dialogSystem.displayDefeatDialog();
        }
        const notDefeatedBots = this.players.bots().filter(function(player: Player) {
            return player.isDefeated() == false;
        });
        if (notDefeatedBots.length == 0) {
            this.dialogSystem.displayVictoryDialog();
        }
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

        const layer = collisionLayer;
        aliveVehicles.all().map(function(vehicle: Vehicle) {
            game.physics.arcade.collide(vehicle, layer);
        });
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

    public shutdown ()
    {
        this.jukebox.destroy();
    }
}
