
import {Army} from "../../Army";
import {ItemRepository} from "../../item/ItemRepository";
import {BuildingRepository} from "../../building/BuildingRepository";
import {VehicleRepository} from "../VehicleRepository";
import {Oil} from "../../item/Oil";
import {Vehicle} from "../Vehicle";

export class Camera
{
    private army: Army;
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private vehicles: VehicleRepository;

    constructor(items: ItemRepository, buildings: BuildingRepository, vehicles: VehicleRepository, army: Army)
    {
        this.items = items;
        this.buildings = buildings;
        this.vehicles = vehicles;
        this.army = army;
    }

    public closestVisibleEnemy(position: Phaser.Point, visibilityScope: number): Vehicle|null
    {
        class VehicleAndDistance {
            public vehicle: Vehicle;
            public distance: number;
            constructor (vehicle: Vehicle, distance: number) {
                this.vehicle = vehicle;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function(vehicle: Vehicle) {
            return new VehicleAndDistance(vehicle, position.distance(vehicle.getPosition()));
        };
        const myArmy = this.army;
        const closestEnemies = this.vehicles.all()
            .filter(function (vehicle: Vehicle) {
                    return vehicle.getArmy() != myArmy;
                }
            )
            .reduce(function (vehiclesWithDistance, vehicle) {
                vehiclesWithDistance.push(transfoAddDistance(vehicle));
                return vehiclesWithDistance;
            }, [])
            .sort(function (vehicle1: VehicleAndDistance, vehicle2: VehicleAndDistance) {
                return vehicle1.distance > vehicle2.distance ? 1 : -1;
            })
            .filter(function (vehicleAndDistance: VehicleAndDistance) {
                    return vehicleAndDistance.distance < visibilityScope
                }
            );

        return closestEnemies.length > 0 ? closestEnemies[0].vehicle : null;
    }

    public closestVisibleOil(position: Phaser.Point, visibilityScope: number): Oil|null
    {
        class OilAndDistance {
            public oil: Oil;
            public distance: number;
            constructor (oil: Oil, distance: number) {
                this.oil = oil;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function(oil: Oil) {
            return new OilAndDistance(oil, position.distance(oil.getPosition()));
        };
        const closestOils = this.items.oils()
            .reduce(function (oilsWithDistance, oil) {
                oilsWithDistance.push(transfoAddDistance(oil));
                return oilsWithDistance;
            }, [])
            .sort(function (oil1: OilAndDistance, oil2: OilAndDistance) {
                return oil1.distance > oil2.distance ? 1 : -1;
            })
            .filter(function (oilAndDistance: OilAndDistance) {
                    return oilAndDistance.distance < visibilityScope && !oilAndDistance.oil.hasBeenCollected()
                }
            );

        return closestOils.length > 0 ? closestOils[0].oil : null;
    }
}