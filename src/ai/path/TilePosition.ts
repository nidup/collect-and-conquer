
/**
 * Position in the tilemap
 */
export class TilePosition
{
    private x: number;
    private y: number;

    constructor (x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }

    public getX() :number
    {
        return this.x;
    }

    public getY() :number
    {
        return this.y;
    }
}
