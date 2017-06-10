
import {Army} from "../../world/Army";
import {Building} from "../../world/building/Building";

export class Player
{
    private army: Army;
    private human: boolean;

    constructor(army: Army, human: boolean)
    {
        this.army = army;
        this.human = human;
    }

    public play()
    {
        // TODO extract Play state logic
    }

    public getArmy(): Army
    {
        return this.army;
    }

    public isHuman(): boolean
    {
        return this.human;
    }

    public isDefeated(): boolean
    {
        const notdestroyedBuildings = this.getArmy().getBuildings().filter(function (building: Building) {
           return building.isDestroyed() == false;
        });

        return notdestroyedBuildings.length == 0;
    }
}
