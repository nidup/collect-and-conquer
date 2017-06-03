
export class Map
{
    private tilemap: Phaser.Tilemap;
    private grounds: Array<Array<number>>;

    public constructor(tilemap: Phaser.Tilemap, grounds: Array<Array<number>>)
    {
        this.tilemap = tilemap;
        this.grounds = grounds;
    }

    public getTilemap(): Phaser.Tilemap
    {
        return this.tilemap;
    }

    public getGrounds(): Array<Array<number>>
    {
        return this.grounds;
    }
}