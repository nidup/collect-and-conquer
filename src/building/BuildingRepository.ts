
import {Building} from "./Building";

export class BuildingRepository
{
    private building : Building[];

    public constructor()
    {
        this.building = [];
    }

    public add(building: Building): void
    {
        this.building.push(building);
    }

    public length(): number
    {
        return this.building.length;
    }

    public get(index: number) :Building
    {
        return this.building[index];
    }
}