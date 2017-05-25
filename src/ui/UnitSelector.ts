
import {Bot} from "../vehicle/Bot";
import {Building} from "../building/Building";
import {Item} from "../item/Item";
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
            bot.events.onInputDown.add(function() {
                myself.selectUnit(bot);
            }, this);
        });
    }

    public listenBuildings(buildings: Building[])
    {
        const myself = this;
        buildings.map(function (building: Building) {
            building.events.onInputDown.add(function() {
                myself.selectUnit(building);
            }, this);
        });
    }

    public listenItems(items: Item[])
    {
        const myself = this;
        items.map(function (item: Item) {
            item.events.onInputDown.add(function() {
                myself.selectUnit(item);
            }, this);
        });
    }
}