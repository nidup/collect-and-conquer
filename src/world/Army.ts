
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

export class Army
{
    private color: string;
    private vehicles: VehicleRepository;
    private buildings: BuildingRepository;
    private items: ItemRepository;
    private radar: Radar;
    private mapAnalyse: MapAnalyse;
    private game: Phaser.Game;

    constructor(color: string, vehicles: VehicleRepository, buildings: BuildingRepository, items: ItemRepository, mapAnalyse: MapAnalyse, game: Phaser.Game)
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
        const vehicle = new Miner(this.game, x, y, this, 'Miner', 0, this.mapAnalyse, this.radar, this.buildings);
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

    public getColor()
    {
        return this.color;
    }
}
