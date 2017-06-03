
export class Map
{
    private tilemap: Phaser.Tilemap;

    public constructor(tilemap: Phaser.Tilemap)
    {
        this.tilemap = tilemap;
    }

    public getTilemap(): Phaser.Tilemap
    {
        return this.tilemap;
    }
}