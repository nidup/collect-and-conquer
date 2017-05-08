
export class StackFSM
{
    private stack :Function[];

    constructor()
    {
        this.stack = [];
    }

    public update() :void
    {
        const currentStateFunction :Function = this.getCurrentState();
        if (currentStateFunction != null) {
            currentStateFunction();
        }
    }

    public popState() :Function
    {
        return this.stack.pop();
    }

    public pushState(state :Function) :void
    {
        if (this.getCurrentState() != state) {
            this.stack.push(state);
        }
    }

    public getCurrentState() :Function
    {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}
