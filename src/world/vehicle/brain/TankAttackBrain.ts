
import {VehicleBrain} from "./VehicleBrain";
import {Tank} from "../Tank";
import {State} from "../../../ai/fsm/State";
import {Miner} from "../Miner";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";
import {PathFinder} from "../../../ai/path/PathFinder";
import {StackFSM} from "../../../ai/fsm/StackFSM";

/**
 * Attacking FSM
 * - Wander Attack Vehicle -> Pursuing Enemy + Attack
 * - Wander Attack Building -> Go to Building + Attack
 */
export class TankAttackBrain extends VehicleBrain
{
    private host: Tank;
    private pathfinder: PathFinder;
    private path: PhaserPointPath;

    public constructor(tank: Tank, pathfinder: PathFinder)
    {
        super();
        this.host = tank;
        this.pathfinder = pathfinder;

        this.fsm.pushState(new State('explore', this.explore));
    }

    private explore = () =>
    {
        const knownEnemyBuilding = this.host.getRadar().closestKnownAttackableEnemyBuilding(this.host.getPosition().clone());
        const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
        if (visibleEnemyVehicle) {
            this.fsm.popState();
            this.fsm.pushState(new State('attack vehicle', this.attackVehicle));
        } else if (knownEnemyBuilding) {
            this.fsm.popState();
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), knownEnemyBuilding.getPosition().clone());
            this.fsm.pushState(new State('go to building', this.gotoBuilding));
        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        }
    }

    private attackVehicle = () =>
    {
        const enemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
        if (enemy !== null) {
            const distance = this.host.getPosition().distance(enemy.getPosition());
            if (distance > (this.host.getAttackScope() / 2)) {
                this.host.getSteeringComputer().pursuing(enemy);
            }
            this.host.attackVehicle(enemy);
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    public gotoBuilding = () =>
    {
        const canAttackBuilding = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getAttackScope();
        const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
        if (visibleEnemyVehicle) {
            this.fsm.popState();
            this.path = null;
            this.fsm.pushState(new State('attack vehicle', this.attackVehicle));
        } else if (!canAttackBuilding) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('attack building', this.attackBuilding));
        }
    }

    private attackBuilding = () =>
    {
        const building = this.host.getRadar().closestKnownAttackableEnemyBuilding(this.host.getPosition().clone());
        const notDestroyed = building && !building.isDestroyed();
        const canAttack = building && this.host.getPosition().distance(building.getPosition()) < this.host.getAttackScope();
        const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
        if (visibleEnemyVehicle) {
            this.fsm.popState();
            this.path = null;
            this.fsm.pushState(new State('attack vehicle', this.attackVehicle));
        } else if (notDestroyed && canAttack) {
            // TODO: should be implemented as a proper behavior
            this.host.getSteeringComputer().reset();
            this.host.getBody().velocity = new Phaser.Point(0, 0);
            this.host.attackBuilding(building);
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }
}
