
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

    public add(vehicle: Vehicle): void
    {
        this.vehicles.push(vehicle);
    }

    public remove(vehicle: Vehicle): void
    {
        const index = this.vehicles.indexOf(vehicle);
        this.vehicles.splice(index, 1);
    }

    public length(): number
    {
        return this.vehicles.length;
    }
}