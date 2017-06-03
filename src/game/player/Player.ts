
import {Army} from "../../world/Army";

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
}
