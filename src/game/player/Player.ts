
import {Army} from "../../world/Army";

export class Player
{
    private army: Army;

    constructor(army: Army)
    {
        this.army = army;
    }

    public play()
    {
        // TODO extract Play state logic
    }
}
