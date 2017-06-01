
import {VehicleBrain} from "./VehicleBrain";
import {Builder} from "../Builder";
import {PathFinder} from "../../../ai/path/PathFinder";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";
import {State} from "../../../ai/fsm/State";

export class BuilderDefendBrain extends VehicleBrain
{
    private host: Builder;
    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    public constructor(builder: Builder, pathfinder: PathFinder)
    {
        super();
        this.host = builder;
        this.pathfinder = pathfinder;

        this.fsm.pushState(new State('path following', this.pathFollowing));
    }

    public pathFollowing = () =>
    {
        if (this.path && this.path.lastNode() && this.host.getPosition().distance(this.path.lastNode()) > 20) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('wander', this.wander));
        }
    }

    public wander = () =>
    {
        if (this.path == null) {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('path following', this.pathFollowing));
        }
    }
}
