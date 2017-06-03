
import {VehicleRepository} from "./vehicle/VehicleRepository";
import {Radar} from "./vehicle/sensor/Radar";
import {BuildingRepository} from "./building/BuildingRepository";
import {ItemRepository} from "./item/ItemRepository";
import {Miner} from "./vehicle/Miner";
import {Scout} from "./vehicle/Scout";
import {Tank} from "./vehicle/Tank";
import {Builder} from "./vehicle/Builder";
import {Base} from "./building/Base";
import {Generator} from "./building/Generator";
import {Mine} from "./building/Mine";
import {Oil} from "./item/Oil";
import {Strategy} from "./Strategy";
import {Building} from "./building/Building";
import {Vehicle} from "./vehicle/Vehicle";
import {Map} from "../ai/map/Map";
import {Camera} from "./vehicle/sensor/Camera";

export class Army
{
    private color: number;
    private strategy: Strategy;
    private vehicles: VehicleRepository;
    private buildings: BuildingRepository;
    private items: ItemRepository;
    private radar: Radar;
    private map: Map;
    private game: Phaser.Game;

    constructor(color: number, vehicles: VehicleRepository, buildings: BuildingRepository, items: ItemRepository, map: Map, game: Phaser.Game)
    {
        this.color = color;
        this.strategy = new Strategy();
        this.vehicles = vehicles;
        this.buildings = buildings;
        this.items = items;
        this.map = map;
        this.game = game;
        this.radar = new Radar(this.items, this.buildings, this.vehicles, this);
    }

    public recruitMiner(x: number, y: number): Miner
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 180);
        const vehicle = new Miner(this.game, x, y, this, this.radar, camera, 'Miner', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitScout(x: number, y: number): Scout
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 240);
        const vehicle = new Scout(this.game, x, y, this, this.radar, camera, 'Scout1', 0);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitTank(x: number, y: number): Tank
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 180);
        const vehicle = new Tank(this.game, x, y, this, this.radar, camera, 'Tank5', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitBuilder(x: number, y: number): Builder
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 180);
        const vehicle = new Builder(this.game, x, y, this, this.radar, camera, 'Builder1', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public buildBase(x: number, y:number): Base
    {
        const building = new Base(this.game, x, y, this, 'Base', 0);
        this.buildings.add(building);
        return building;
    }

    public buildGenerator(x: number, y:number): Generator
    {
        const building = new Generator(this.game, x, y, this, 'Generator', 0);
        this.buildings.add(building);
        return building;
    }

    public buildMine(x: number, y:number, oil: Oil): Mine
    {
        const building = new Mine(this.game, x, y, this, 'Mine', 0, oil.getQuantity())
        this.buildings.add(building);
        return building;
    }

    public getColor(): number
    {
        return this.color;
    }

    public getStrategy(): Strategy
    {
        return this.strategy;
    }

    public getBase(): Base
    {
        const myself = this;
        return this.buildings.bases()
            .filter(function (base: Base) {
                    return base.getArmy() == myself;
                }
            )[0];
    }

    public getBuildings(): Building[]
    {
        const myself = this;
        return this.buildings.all().filter(function (building: Building) {
                return building.getArmy() == myself;
            }
        );
    }

    public getVehicles(): Vehicle[]
    {
        const myself = this;
        return this.vehicles.all().filter(function (vehicle: Vehicle) {
                return vehicle.getArmy() == myself;
            }
        );
    }
}
