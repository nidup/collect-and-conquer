
import {VehicleBrain} from "./VehicleBrain";
import {Miner} from "../Miner";
import {State} from "../../../ai/fsm/State";
import {PathFinder} from "../../../ai/path/PathFinder";
import {PhaserPointPath} from "../../../ai/path/PhaserPointPath";

/**
 * Wander Collect -> Go to mine -> Load -> Go to base -> Unload -> Go to mine
 * Wander Oil -> Go to oil -> Build mine (destroy)
 */
export class MinerCollectBrain extends VehicleBrain
{
    private host: Miner;
    private pathfinder: PathFinder;
    private path: PhaserPointPath;
    
    public constructor(miner: Miner, pathfinder: PathFinder)
    {
        super();
        this.host = miner;
        this.pathfinder = pathfinder;
        this.fsm.pushState(new State('explore', this.explore));
    }

    public explore = () =>
    {
        const oil = this.host.getRadar().closestVisibleOil(this.host.getPosition(), this.host.getVisibilityScope());
        const mine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        const base = this.host.getRadar().closestBase(this.host.getPosition());
        const knowBaseAndMine = mine != null && base != null;
        const knowMinePlaceholder = oil != null;

        if (knowBaseAndMine) {
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), mine.getPosition().clone());
            if (this.path) {
                this.fsm.popState();
                this.fsm.pushState(new State('go to mine', this.gotoMine));
            }
        } else if (knowMinePlaceholder) {
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), oil.getPosition().clone());
            this.fsm.popState();
            this.fsm.pushState(new State('go to oil', this.gotoOil));

        } else {
            this.host.getSteeringComputer().wander();
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
        }
    }

    public gotoOil = () =>
    {
        const oil = this.host.getRadar().closestVisibleOil(this.host.getPosition(), this.host.getVisibilityScope());
        const lookForOilPosition = !oil;
        const canGoToMinePlaceholder = this.path && this.host.getPosition().distance(this.path.lastNode()) > this.host.getBuildingScope();
        const canBuildMine = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getBuildingScope();
        if (lookForOilPosition) {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        } else if (canGoToMinePlaceholder) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else if (canBuildMine) {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('build mine', this.buildMine));
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    public buildMine = () =>
    {
        const oil = this.host.getRadar().closestVisibleOil(this.host.getPosition(), this.host.getVisibilityScope());
        if (oil) {
            this.host.buildMine(oil);
            this.fsm.popState();
            this.fsm.pushState(new State('extracting', this.extracting));
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    public extracting = () =>
    {
        // IDLE : TODO: unbuild the mine?
    }

    public gotoMine = () =>
    {
        // TODO: change path is a closer is built?

        const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        const canLoadOil = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getBuildingScope();

        if (!exploitableMine) {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        } else if (!canLoadOil) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('load oil', this.loadOil));
        }
    }

    public loadOil = () =>
    {
        const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());

        if (exploitableMine) {
            this.host.loadOil(exploitableMine);
            const base = this.host.getRadar().closestBase(this.host.getPosition());
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), base.getPosition().clone());
            this.fsm.popState();
            this.fsm.pushState(new State('go to base', this.gotoBase));
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }

    public gotoBase = () =>
    {
        const canUnloadOil = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getBuildingScope();
        if (!canUnloadOil) {
            this.host.getSteeringComputer().pathFollowing(this.path);
            this.host.getSteeringComputer().reactToCollision(this.host.getBody());
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('unload oil', this.unloadOil));
        }
    }

    public unloadOil = () =>
    {
        const base = this.host.getRadar().closestBase(this.host.getPosition());
        this.host.unloadOil(base);

        const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
        if (exploitableMine) {
            this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), exploitableMine.getPosition().clone());
            this.fsm.popState();
            this.fsm.pushState(new State('go to mine', this.gotoMine));
        } else {
            this.path = null;
            this.fsm.popState();
            this.fsm.pushState(new State('explore', this.explore));
        }
    }
}
