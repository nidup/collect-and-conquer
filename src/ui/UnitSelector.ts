
import {Vehicle} from "../world/vehicle/Vehicle";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
import {Player} from "../game/player/Player";
import {Oil} from "../world/item/Oil";

export class UnitSelector
{
    private selectedUnit: Phaser.Sprite;
    private player: Player;

    public constructor(player: Player)
    {
        this.player = player;
    }

    public selectUnit(unit: Phaser.Sprite)
    {
        this.selectedUnit = unit;
    }

    public getSelectedUnit() :Phaser.Sprite|null
    {
        return this.selectedUnit;
    }

    public listenVehicles(vehicles: Vehicle[])
    {
        const myself = this;
        vehicles.map(function (vehicle: Vehicle) {
            if (vehicle.events.onInputDown.getNumListeners() == 0) {
                vehicle.events.onInputDown.add(function() {
                    myself.selectUnit(vehicle);
                }, this);
            }
        });
    }

    public listenBuildings(buildings: Building[])
    {
        const myself = this;
        buildings.map(function (building: Building) {
            if (building.events.onInputDown.getNumListeners() == 0) {
                building.events.onInputDown.add(function () {

                    const myBuilding = building.getArmy() == myself.player.getArmy();
                    if (myBuilding) {
                        myself.selectUnit(building);
                    } else {
                        let known = false;
                        myself.player.getArmy().getSharedMemory().getKnownEnemyBuildings().forEach(function(knownBuilding: Building) {
                            if (knownBuilding == building) {
                                known = true;
                            }
                        });
                        if (known) {
                            myself.selectUnit(building);
                        }
                    }

                }, this);
            }
        });
    }

    public listenItems(items: Item[])
    {
        const myself = this;
        items.map(function (item: Item) {
            if (item.events.onInputDown.getNumListeners() == 0) {
                item.events.onInputDown.add(function () {

                    let known = false;
                    myself.player.getArmy().getSharedMemory().getKnownOils().forEach(function(knownOil: Oil) {
                        if (knownOil == item) {
                            known = true;
                        }
                    });
                    if (known) {
                        myself.selectUnit(item);
                    }

                }, this);
            }
        });
    }
}