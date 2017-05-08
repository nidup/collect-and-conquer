
export class MapAnalyse
{
    private tiles: Array<Array<Phaser.Tile>>;
    private tileSize: number;
    private walkableIndexes: Array<number>;
    private unwalkableIndexes: Array<number>;

    constructor (indexes: Array<Array<Phaser.Tile>>, tileSize: number, walkableIndexes: Array<number>, unwalkableIndexes: Array<number>)
    {
        this.tiles = indexes;
        this.tileSize = tileSize;
        this.walkableIndexes = walkableIndexes;
        this.unwalkableIndexes = unwalkableIndexes;
    }

    public getTiles() : Array<Array<Phaser.Tile>>
    {
        return this.tiles;
    }

    public getTileSize() : number
    {
        return this.tileSize;
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
