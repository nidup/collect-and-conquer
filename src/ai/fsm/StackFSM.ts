
import {State} from "./State";

/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867
 */
export class StackFSM
{
    private stack :State[];

    constructor()
    {
        this.stack = [];
    }

    public update() :void
    {
        const currentState = this.getCurrentState();
        const currentStateFunction :Function = currentState.getFunc();
        if (currentStateFunction != null) {
            currentStateFunction();
        }
    }

    public popState() :State
    {
        return this.stack.pop();
    }

    public pushState(state :State) :void
    {
        if (this.getCurrentState() != state) {
            this.stack.push(state);
        }
    }

    public getCurrentState() :State
    {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}
