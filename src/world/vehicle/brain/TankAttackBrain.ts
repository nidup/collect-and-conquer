
import {VehicleBrain} from "./VehicleBrain";
import {Tank} from "../Tank";
import {State} from "../../../ai/fsm/State";
import {Miner} from "../Miner";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";
import {PathFinder} from "../../../ai/path/PathFinder";
import {StackFSM} from "../../../ai/fsm/StackFSM";

/**
 * Attacking FSM
 * - Wander Attack -> Pursuing + Attack
 */
export class TankAttackBrain extends VehicleBrain
{
    private host: Tank;

    public constructor(tank: Tank)
    {
        super();
        this.host = tank;

        this.fsm.pushState(new State('explore', this.explore));
    }

    private explore = () =>
    {
        const visibleEnemy = this.host.getCamera().closestVisibleEnemy(this.host.getPosition().clone());
        if (visibleEnemy) {
            this.fsm.popState();
            this.fsm.pushState(new State('attack', this.attackEnemy));
        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        }
    }

    private attackEnemy = () =>
    {
        const enemy = this.host.getCamera().closestVisibleEnemy(this.host.getPosition().clone());
        if (enemy !== null) {
            this.host.getSteeringComputer().pursuing(enemy);
            this.host.attack(enemy);
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }
}
