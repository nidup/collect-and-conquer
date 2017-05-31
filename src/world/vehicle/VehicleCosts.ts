
import {Miner} from "./Miner";
import {Builder} from "./Builder";
import {Scout} from "./Scout";
import {Tank} from "./Tank";

export class VehicleCosts
{
    getCost(vehicle :Function) :number
    {
        if (vehicle == Miner) {
            return 100;
        } else if (vehicle == Builder) {
            return 80;
        } else if (vehicle == Scout) {
            return 60;
        } else if (vehicle == Tank) {
                return 180;
        } else {
            throw new Error;
        }
    }
}
