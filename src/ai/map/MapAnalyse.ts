
export class MapAnalyse
{
    private walkableIndexes: number[];
    private unwalkableIndexes: number[];

    constructor (walkableIndexes: number[], unwalkableIndexes: number[])
    {
        this.walkableIndexes = walkableIndexes;
        this.unwalkableIndexes = unwalkableIndexes;
    }

    public getWalkableIndexes()
    {
        return this.walkableIndexes;
    }

    public getUnwalkableIndexes()
    {
        return this.unwalkableIndexes;
    }
}
