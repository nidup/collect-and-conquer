
import {VehicleBrain} from "./VehicleBrain";
import {Scout} from "../Scout";
import {State} from "../../../ai/fsm/State";

export class ScoutExploreBrain extends VehicleBrain
{
    private host: Scout;

    public constructor(scout: Scout)
    {
        super();
        this.host = scout;

        this.fsm.pushState(new State('wander', this.wander));
    }

    public wander = () =>
    {
        const enemy = this.host.getRadar().closestVisibleEnemy(this.host.getPosition().clone(), this.host.getVisibilityScope());
        if (enemy !== null) {
            this.fsm.pushState(new State('evading', this.evading));

        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        }
    }

    public evading = () =>
    {
        const enemy = this.host.getRadar().closestVisibleEnemy(this.host.getPosition().clone(), this.host.getVisibilityScope());
        if (enemy !== null) {
            // TODO: flee makes something more natural when pursuing!
            // TODO: sometimes both vehicle and enemy does not move anymore!
            //this.host.getSteeringComputer().evading(enemy);
            this.host.getSteeringComputer().flee(enemy.getPosition());
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
        } else {
            this.fsm.popState();
        }
    }
}