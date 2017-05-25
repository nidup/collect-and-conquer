

import {ItemRepository} from "../../item/ItemRepository";
import {BuildingRepository} from "../../building/BuildingRepository";
import {BotRepository} from "../BotRepository";
import {Oil} from "../../item/Oil";
import {Mine} from "../../building/Mine";
import {Base} from "../../building/Base";
import {Item} from "../../item/Item";

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
                    return oilAndDistance.distance < scope && !oilAndDistance.oil.hasBeenCollected()
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
        const closestMines = this.buildings.mines()
            .reduce(function (minesWithDistance, mine) {
                minesWithDistance.push(transfoAddDistance(mine));
                return minesWithDistance;
            }, [])
            .sort(function (mine1: MineAndDistance, mine2: MineAndDistance) {
                return mine1.distance > mine2.distance ? 1 : -1;
            })
            .filter(function (mineAndDistance: MineAndDistance) {
                    return mineAndDistance.mine.isCollecting()
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
        const closestBases = this.buildings.bases()
            .reduce(function (basesWithDistance, base) {
                basesWithDistance.push(transfoAddDistance(base));
                return basesWithDistance;
            }, [])
            .sort(function (base1: BaseAndDistance, base2: BaseAndDistance) {
                return base1.distance > base2.distance ? 1 : -1;
            });

        return closestBases.length > 0 ? closestBases[0].base : null;
    }
}