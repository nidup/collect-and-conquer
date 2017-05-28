
import {Vehicle} from "./Vehicle";

export class VehicleRepository
{
    private vehicles : Vehicle[];

    public constructor()
    {
        this.vehicles = [];
    }

    public all(): Vehicle[]
    {
        return this.vehicles;
    }

    public add(bot: Vehicle): void
    {
        this.vehicles.push(bot);
    }

    public remove(bot: Vehicle): void
    {
        const index = this.vehicles.indexOf(bot);
        this.vehicles.splice(index, 1);
    }

    public enemiesOf(myself: Vehicle) :Vehicle[]
    {
        return this.vehicles.filter(function (bot: Vehicle) { return bot != myself; });
    }

    public first(): Vehicle
    {
        return this.get(0);
    }

    public length(): number
    {
        return this.vehicles.length;
    }

    public get(index: number) :Vehicle
    {
        return this.vehicles[index];
    }
}