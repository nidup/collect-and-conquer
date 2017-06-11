
import {VehicleBrain} from "./VehicleBrain";
import {Engineer} from "../Engineer";
import {PathFinder} from "../../../ai/path/PathFinder";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";
import {State} from "../../../ai/fsm/State";

/**
 * Defending FSM
 * - Wander Go to hurted Unit -> healing
 * - Wander Go to hurted Building -> healing
 */
export class EngineerDefendBrain extends VehicleBrain
{
    private host: Engineer;
    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    public constructor(engineer: Engineer, pathfinder: PathFinder)
    {
        super();
        this.host = engineer;
        this.pathfinder = pathfinder;

        this.fsm.pushState(new State('explore', this.explore));
    }

    public explore = () =>
    {
        const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
        const damagedBuilding = this.host.getRadar().closestKnownRepairableFriendBuilding(this.host.getPosition().clone());
        if (hurtedFriend) {
            this.fsm.popState();
            this.fsm.pushState(new State('repair vehicle', this.repairVehicle));
        } else if (damagedBuilding && damagedBuilding.getPosition()) {
            this.fsm.popState();
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), damagedBuilding.getPosition().clone());
            this.fsm.pushState(new State('go to building', this.gotoBuilding));
        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        }
    }

    private repairVehicle = () =>
    {
        const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
        if (hurtedFriend !== null) {
            const distance = this.host.getPosition().distance(hurtedFriend.getPosition());
            if (distance > (this.host.getRepairScope() / 2)) {
                this.host.getSteeringComputer().pursuing(hurtedFriend);
            }
            this.host.repairVehicle(hurtedFriend);
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    public gotoBuilding = () =>
    {
        const canRepairBuilding = this.path && this.path.lastNode() && this.host.getPosition().distance(this.path.lastNode()) < this.host.getRepairScope();
        const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
        if (hurtedFriend) {
            this.fsm.popState();
            this.path = null;
            this.fsm.pushState(new State('repair vehicle', this.repairVehicle));
        } else if (!canRepairBuilding) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('repair building', this.repairBuilding));
        }
    }

    private repairBuilding = () =>
    {
        const building = this.host.getRadar().closestKnownRepairableFriendBuilding(this.host.getPosition().clone());
        const damaged = building && building.isDamaged();
        const canRepair = building && building.getPosition() && this.host.getPosition().distance(building.getPosition()) < this.host.getRepairScope();
        const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
        if (hurtedFriend) {
            this.fsm.pushState(new State('repair vehicle', this.repairVehicle));
        } else if (damaged && canRepair) {
            // TODO: should be implemented as a proper behavior
            this.host.getSteeringComputer().reset();
            this.host.getBody().velocity = new Phaser.Point(0, 0);
            this.host.repairBuilding(building);
        } else {
            this.fsm.pushState(new State('explore', this.explore));
        }
    }
}
