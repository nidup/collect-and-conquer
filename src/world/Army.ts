
import {VehicleRepository} from "./vehicle/VehicleRepository";
import {Radar} from "./vehicle/sensor/Radar";
import {BuildingRepository} from "./building/BuildingRepository";
import {ItemRepository} from "./item/ItemRepository";
import {Miner} from "./vehicle/Miner";
import {Scout} from "./vehicle/Scout";
import {Tank} from "./vehicle/Tank";
import {Engineer} from "./vehicle/Engineer";
import {Base} from "./building/Base";
import {Generator} from "./building/Generator";
import {Mine} from "./building/Mine";
import {Oil} from "./item/Oil";
import {Strategy} from "./Strategy";
import {Building} from "./building/Building";
import {Vehicle} from "./vehicle/Vehicle";
import {Map} from "../ai/map/Map";
import {Camera} from "./vehicle/sensor/Camera";
import {SharedMemory} from "./vehicle/knowledge/SharedMemory";
import {JukeBox} from "./audio/JukeBox";

export class Army
{
    private color: number;
    private strategy: Strategy;
    private vehicles: VehicleRepository;
    private buildings: BuildingRepository;
    private items: ItemRepository;
    private radar: Radar;
    private map: Map;
    private group: Phaser.Group;
    private sharedMemory: SharedMemory;
    private jukebox: JukeBox;

    constructor(color: number, vehicles: VehicleRepository, buildings: BuildingRepository, items: ItemRepository, map: Map, group: Phaser.Group, jukebox: JukeBox)
    {
        this.color = color;
        this.strategy = new Strategy();
        this.vehicles = vehicles;
        this.buildings = buildings;
        this.items = items;
        this.map = map;
        this.group = group;
        this.sharedMemory = new SharedMemory(map);
        this.radar = new Radar(this.items, this.buildings, this.vehicles, this, this.sharedMemory);
        this.jukebox = jukebox;
    }

    public recruitMiner(x: number, y: number): Miner
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 140);
        const vehicle = new Miner(this.group, x, y, this, this.radar, camera, 'Miner', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitScout(x: number, y: number): Scout
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 240);
        const vehicle = new Scout(this.group, x, y, this, this.radar, camera, 'Scout1', 0);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitTank(x: number, y: number): Tank
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 180);
        const vehicle = new Tank(this.group, x, y, this, this.radar, camera, 'Tank5', 0, this.map, this.jukebox);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitEngineer(x: number, y: number): Engineer
    {
        const camera = new Camera(this.items, this.buildings, this.vehicles, this, 140);
        const vehicle = new Engineer(this.group, x, y, this, this.radar, camera, 'Builder1', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public buildBase(x: number, y:number): Base
    {
        const building = new Base(this.group, x, y, this, 'Base', 0);
        this.buildings.add(building);
        this.sharedMemory.registerGrounds(building.getPosition(), 200);
        return building;
    }

    public buildGenerator(x: number, y:number): Generator
    {
        const building = new Generator(this.group, x, y, this, 'Generator', 0);
        this.buildings.add(building);
        return building;
    }

    public buildMine(x: number, y:number, oil: Oil): Mine
    {
        const building = new Mine(this.group, x, y, this, 'Mine', 0, oil.getQuantity());
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

    public getSharedMemory(): SharedMemory
    {
        return this.sharedMemory;
    }
}
