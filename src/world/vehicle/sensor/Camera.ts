
import {Army} from "../../Army";
import {ItemRepository} from "../../item/ItemRepository";
import {BuildingRepository} from "../../building/BuildingRepository";
import {VehicleRepository} from "../VehicleRepository";
import {Oil} from "../../item/Oil";
import {Vehicle} from "../Vehicle";
import {Building} from "../../building/Building";

export class Camera
{
    private army: Army;
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private vehicles: VehicleRepository;
    private visibilityScope: number;

    constructor(items: ItemRepository, buildings: BuildingRepository, vehicles: VehicleRepository, army: Army, visibilityScope: number)
    {
        this.items = items;
        this.buildings = buildings;
        this.vehicles = vehicles;
        this.army = army;
        this.visibilityScope = visibilityScope;
    }

    public getVisibilityScope(): number
    {
        return this.visibilityScope;
    }

    public closestVisibleEnemy(position: Phaser.Point): Vehicle|null
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
        const visibilityScope = this.visibilityScope;
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

    public visibleOils(position: Phaser.Point): Array<Oil>
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
        const visibilityScope = this.visibilityScope;
        const visibleOils = this.items.oils()
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
            ).reduce(function (visibleOils, visibleOilAndDistance: OilAndDistance) {
                visibleOils.push(visibleOilAndDistance.oil);
                return visibleOils;
            }, []);

        return visibleOils;
    }

    public visibleEnemyBuildings(position: Phaser.Point): Array<Building>
    {
        class BuildingAndDistance {
            public building: Building;
            public distance: number;
            constructor (building: Building, distance: number) {
                this.building = building;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function(building: Building) {
            return new BuildingAndDistance(building, position.distance(building.getPosition()));
        };
        const visibilityScope = this.visibilityScope;
        const myArmy = this.army;
        const visibleBuildings = this.buildings.all()
            .filter(function (building: Building) {
                return building.getArmy() != myArmy;
            })
            .reduce(function (buildingsWithDistance, building) {
                buildingsWithDistance.push(transfoAddDistance(building));
                return buildingsWithDistance;
            }, [])
            .sort(function (building1: BuildingAndDistance, building2: BuildingAndDistance) {
                return building1.distance > building2.distance ? 1 : -1;
            })
            .filter(function (buildingAndDistance: BuildingAndDistance) {
                    return buildingAndDistance.distance < visibilityScope
                }
            ).reduce(function (visibleBuildings, visibleBuildingAndDistance: BuildingAndDistance) {
                visibleBuildings.push(visibleBuildingAndDistance.building);
                return visibleBuildings;
            }, []);

        return visibleBuildings;
    }
}
