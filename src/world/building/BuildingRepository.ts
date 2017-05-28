
import {Building} from "./Building";
import {Base} from "./Base";
import {Mine} from "./Mine";

export class BuildingRepository
{
    private buildings : Building[];

    public constructor()
    {
        this.buildings = [];
    }

    public all(): Building[]
    {
        return this.buildings;
    }

    public bases(): Base[]
    {
        return <Base[]>this.buildings.filter(function (building: Building) { return building instanceof Base; });
    }

    public mines(): Mine[]
    {
        return <Mine[]>this.buildings.filter(function (building: Building) { return building instanceof Mine; });
    }

    public add(building: Building): void
    {
        this.buildings.push(building);
    }

    public length(): number
    {
        return this.buildings.length;
    }
}