
export class State
{
    private name: string;
    private func: Function;

    constructor(name: string, func: Function)
    {
        this.name = name;
        this.func = func;
    }

    public getName() :string
    {
        return this.name;
    }

    public getFunc() :Function
    {
        return this.func;
    }
}
