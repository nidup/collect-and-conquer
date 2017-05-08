
export class MapAnalyse
{
    private tiles: Array<Array<Phaser.Tile>>;
    private walkableIndexes: Array<number>;
    private unwalkableIndexes: Array<number>;

    constructor (indexes: Array<Array<Phaser.Tile>>, walkableIndexes: Array<number>, unwalkableIndexes: Array<number>)
    {
        this.tiles = indexes;
        this.walkableIndexes = walkableIndexes;
        this.unwalkableIndexes = unwalkableIndexes;
    }

    public getTiles() : Array<Array<Phaser.Tile>>
    {
        return this.tiles;
    }

    public getWalkableIndexes() : Array<number>
    {
        return this.walkableIndexes;
    }

    public getUnwalkableIndexes() : Array<number>
    {
        return this.unwalkableIndexes;
    }
}
