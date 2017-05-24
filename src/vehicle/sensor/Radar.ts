

import {ItemRepository} from "../../item/ItemRepository";
import {BuildingRepository} from "../../building/BuildingRepository";
import {BotRepository} from "../BotRepository";
import {Oil} from "../../item/Oil";
import {Mine} from "../../building/Mine";
import {Base} from "../../building/Base";

export class Radar
{
    private items: ItemRepository;
    private buildings: BuildingRepository;
    private bots: BotRepository;

    constructor(items: ItemRepository, buildings: BuildingRepository, bots: BotRepository)
    {
        this.items = items;
        this.buildings = buildings;
        this.bots = bots;
    }

    public closestVisibleOil(position: Phaser.Point, scope: number): Oil|null
    {
        let closestOil = null;
        let closestDistance = scope * 100;
        for (let index = 0; index < this.items.length(); index++) {
            let item = this.items.get(index);
            let distance = position.distance(this.items.get(index).getPosition());
            if (item instanceof Oil && distance < scope && !item.hasBeenCollected() && distance < closestDistance) {
                closestOil = item;
                closestDistance = distance;
            }
        }

        return closestOil;
    }

    public closestExploitableMine(position: Phaser.Point, scope: number): Mine|null
    {
        let closestExploitableMine = null;
        let closestDistance = scope * 100;
        for (let index = 0; index < this.buildings.length(); index++) {
            let building = this.buildings.get(index);
            let distance = position.distance(this.buildings.get(index).getPosition());
            if (building instanceof Mine && (<Mine>building).isCollecting() && distance < closestDistance) {
                closestExploitableMine = building;
                closestDistance = distance;
            }
        }

        return closestExploitableMine;
    }


    public closestBase(position: Phaser.Point, scope: number): Base|null
    {
        let closestBase = null;
        let closestDistance = scope * 100;
        for (let index = 0; index < this.buildings.length(); index++) {
            let building = this.buildings.get(index);
            let distance = position.distance(this.buildings.get(index).getPosition());
            if (building instanceof Base && distance < closestDistance) {
                closestBase = building;
                closestDistance = distance;
            }
        }

        return closestBase;
    }
}