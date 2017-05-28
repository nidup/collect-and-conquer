
import {ItemRepository} from "../../item/ItemRepository";
import {BuildingRepository} from "../../building/BuildingRepository";
import {VehicleRepository} from "../VehicleRepository";
import {Oil} from "../../item/Oil";
import {Mine} from "../../building/Mine";
import {Base} from "../../building/Base";
import {Item} from "../../item/Item";
import {Building} from "../../building/Building";
import {Vehicle} from "../Vehicle";
import {Army} from "../../Army";

export class Radar
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

    // TODO split known / visible -> radio to communicate?

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

    public closestExploitableMine(position: Phaser.Point): Mine|null
    {
        class MineAndDistance {
            public mine: Mine;
            public distance: number;
            constructor (mine: Mine, distance: number) {
                this.mine = mine;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function(mine: Mine) {
            return new MineAndDistance(mine, position.distance(mine.getPosition()));
        };
        const myArmy = this.army;
        const closestMines = this.buildings.mines()
            .filter(function (mine: Mine) {
                    return mine.getArmy() == myArmy;
                }
            )
            .reduce(function (minesWithDistance, mine) {
                minesWithDistance.push(transfoAddDistance(mine));
                return minesWithDistance;
            }, [])
            .sort(function (mine1: MineAndDistance, mine2: MineAndDistance) {
                return mine1.distance > mine2.distance ? 1 : -1;
            })
            .filter(function (mineAndDistance: MineAndDistance) {
                    return mineAndDistance.mine.isExtracting()
                }
            );

        return closestMines.length > 0 ? closestMines[0].mine : null;
    }


    public closestBase(position: Phaser.Point): Base|null
    {
        class BaseAndDistance {
            public base: Base;
            public distance: number;
            constructor (base: Base, distance: number) {
                this.base = base;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function(base: Base) {
            return new BaseAndDistance(base, position.distance(base.getPosition()));
        };
        const myArmy = this.army;
        const closestBases = this.buildings.bases()
            .filter(function (base: Base) {
                    return base.getArmy() == myArmy;
                }
            )
            .reduce(function (basesWithDistance, base) {
                basesWithDistance.push(transfoAddDistance(base));
                return basesWithDistance;
            }, [])
            .sort(function (base1: BaseAndDistance, base2: BaseAndDistance) {
                return base1.distance > base2.distance ? 1 : -1;
            });

        return closestBases.length > 0 ? closestBases[0].base : null;
    }

    public closestObstacle(position: Phaser.Point, visibilityScope: number): Building
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
        const closestBuildings = this.buildings.all()
            .reduce(function (buildingsWithDistance, building) {
                buildingsWithDistance.push(transfoAddDistance(building));
                return buildingsWithDistance;
            }, [])
            .filter(function (building: BuildingAndDistance) {
                return building.distance < visibilityScope;
            })
            .sort(function (building1: BuildingAndDistance, building2: BuildingAndDistance) {
                return building1.distance > building2.distance ? 1 : -1;
            });

        return closestBuildings.length > 0 ? closestBuildings[0].building : null;
    }
}
