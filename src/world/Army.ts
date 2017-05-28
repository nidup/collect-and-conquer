
import {VehicleRepository} from "./vehicle/VehicleRepository";
import {Radar} from "./vehicle/sensor/Radar";
import {BuildingRepository} from "./building/BuildingRepository";
import {ItemRepository} from "./item/ItemRepository";
import {MapAnalyse} from "../ai/map/MapAnalyse";
import {Miner} from "./vehicle/Miner";
import {Vehicle} from "./vehicle/Vehicle";
import {Scout} from "./vehicle/Scout";
import {Tank} from "./vehicle/Tank";
import {Builder} from "./vehicle/Builder";
import {Base} from "./building/Base";
import {Generator} from "./building/Generator";
import {Mine} from "./building/Mine";
import {Oil} from "./item/Oil";

export class Army
{
    private color: number;
    private vehicles: VehicleRepository;
    private buildings: BuildingRepository;
    private items: ItemRepository;
    private radar: Radar;
    private mapAnalyse: MapAnalyse;
    private game: Phaser.Game;

    constructor(color: number, vehicles: VehicleRepository, buildings: BuildingRepository, items: ItemRepository, mapAnalyse: MapAnalyse, game: Phaser.Game)
    {
        this.color = color;
        this.vehicles = vehicles;
        this.buildings = buildings;
        this.items = items;
        this.mapAnalyse = mapAnalyse; // TODO: inject in radar?
        this.game = game;
        this.radar = new Radar(this.items, this.buildings, this.vehicles);
    }

    public recruitMiner(x: number, y: number): Miner
    {
        const vehicle = new Miner(this.game, x, y, this, 'Miner', 0, this.mapAnalyse, this.radar);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitScout(x: number, y: number): Scout
    {
        const vehicle = new Scout(this.game, x, y, this, 'Scout1', 0, this.vehicles, this.radar);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitTank(x: number, y: number): Tank
    {
        const vehicle = new Tank(this.game, x, y, this, 'Tank5', 0, this.vehicles);
        this.vehicles.add(vehicle);
        return vehicle;
    }

    public recruitBuilder(x: number, y: number): Builder
    {
        const vehicle = new Builder(this.game, x, y, this, 'Builder1', 0, this.mapAnalyse, this.radar);
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

    public getColor()
    {
        return this.color;
    }

    public getColorString()
    {
        return this.color.toString(16);

//        console.log(0xff0000);
//        console.log(0xff0000.toString(16));
//        console.log(parseInt(0xff0000.toString(16), 16));

    }
}
