
import {StackFSM} from "../../../ai/fsm/StackFSM";

export class VehicleBrain
{
    protected fsm: StackFSM;

    public constructor()
    {
        this.fsm = new StackFSM();
    }

    public think()
    {
        this.fsm.update();
    }

    public getStateName(): string
    {
        return this.fsm.getCurrentState().getName();
    }
}
