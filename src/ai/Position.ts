
export class Position
{
    private x: number;
    private y: number;

    constructor (x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public getX () {
        return this.x;
    }

    public getY () {
        return this.y;
    }
}
