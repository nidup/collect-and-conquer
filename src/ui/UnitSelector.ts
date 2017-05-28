
import {Bot} from "../world/vehicle/Bot";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
export class UnitSelector
{
    private selectedUnit: Phaser.Sprite;

    public selectUnit(unit: Phaser.Sprite)
    {
        this.selectedUnit = unit;
    }

    public getSelectedUnit() :Phaser.Sprite|null
    {
        return this.selectedUnit;
    }

    public listenBots(bots: Bot[])
    {
        const myself = this;
        bots.map(function (bot: Bot) {
            if (bot.events.onInputDown.getNumListeners() == 0) {
                bot.events.onInputDown.add(function() {
                    myself.selectUnit(bot);
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
                    myself.selectUnit(building);
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
                    myself.selectUnit(item);
                }, this);
            }
        });
    }
}