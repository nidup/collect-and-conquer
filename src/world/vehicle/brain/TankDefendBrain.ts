
import {VehicleBrain} from "./VehicleBrain";
import {Tank} from "../Tank";
import {State} from "../../../ai/fsm/State";
import {Miner} from "../Miner";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";
import {PathFinder} from "../../../ai/path/PathFinder";

/**
 * Defending FSM
 * - Wander Attack -> Pursuing + Attack
 * - Wander Defend Unit (no Mine) -> escorting Miner
 * - Wander Defend Mine -> patrol Mine to Base
 */
export class TankDefendBrain extends VehicleBrain
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
        const visibleEnemy = this.host.getCamera().closestVisibleEnemy(this.host.getPosition().clone());
        const closestMiner = this.host.getRadar().closestTeamate(this.host.getPosition().clone(), Miner);
        const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        const closestBase = this.host.getRadar().closestBase(this.host.getPosition());
        if (visibleEnemy) {
            this.fsm.popState();
            this.fsm.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine) {
            this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
            this.fsm.pushState(new State('protect mine', this.protectingMine));
        } else if (closestMiner) {
            this.fsm.pushState(new State('escorting', this.escortingMiner));
        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        }
    }

    private escortingMiner = () =>
    {
        const visibleEnemy = this.host.getCamera().closestVisibleEnemy(this.host.getPosition().clone());
        const closestMiner = this.host.getRadar().closestTeamate(this.host.getPosition().clone(), Miner);
        const closestBase = this.host.getRadar().closestBase(this.host.getPosition());
        const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        if (visibleEnemy) {
            this.fsm.popState();
            this.fsm.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine) {
            this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
            this.fsm.popState();
            this.fsm.pushState(new State('protect mine', this.protectingMine));
        } else if (closestMiner !== null) {
            this.host.getSteeringComputer().pursuing(closestMiner);
        } else {
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    private protectingMine = () =>
    {
        const visibleEnemy = this.host.getCamera().closestVisibleEnemy(this.host.getPosition().clone());
        const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        if (visibleEnemy) {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('attack', this.attackEnemy));
        } else if (closestMine && this.path) {
            this.host.getSteeringComputer().pathPatrolling(this.path);
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
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
