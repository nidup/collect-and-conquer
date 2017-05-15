
export class State
{
    private name: string;
    private func: Function;
    private color: string;

    constructor(name: string, func: Function, color: string = '#ffffff')
    {
        this.name = name;
        this.func = func;
        this.color = color;
    }

    public getName() :string
    {
        return this.name;
    }

    public getFunc() :Function
    {
        return this.func;
    }

    public getColor() :string
    {
        return this.color;
    }
}
