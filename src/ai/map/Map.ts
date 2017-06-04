
export class Map
{
    public static LAYER_NAME: string = 'Tiles';
    private tilemap: Phaser.Tilemap;
    private grounds: Array<Array<number>>;
    private tilesize: number;
    private tiles: Array<Array<Phaser.Tile>>;
    private walkableIndexes: Array<number>;
    private collisionlayer: Phaser.TilemapLayer;

    public constructor(group: Phaser.Group, tilemap: Phaser.Tilemap, grounds: Array<Array<number>>, tilesize: number)
    {
        this.tilemap = tilemap;
        this.grounds = grounds;
        this.tilesize = tilesize;
        this.tiles = tilemap.layers[0].data;
        this.walkableIndexes = this.prepareWalkableIndexes(this.getUnwalkableIndexes());
        this.configureCollisionLayer(this.tilemap, this.getUnwalkableIndexes());
        this.collisionlayer = this.tilemap.createLayer(Map.LAYER_NAME, tilemap.layers[0].width, tilemap.layers[0].height, group);
    }

    private prepareWalkableIndexes(unwalkableIndexes: Array<number>): Array<number>
    {
        const maxIndex = 400;
        let walkable = [];
        for (let index = 1; index < maxIndex; index++) {
            walkable.push(index);
        }
        walkable.filter(x => unwalkableIndexes.indexOf(x) == -1);

        return walkable;
    }

    private configureCollisionLayer(tilemap: Phaser.Tilemap, unwalkableIndexes: Array<number>)
    {
        tilemap.setCollision(unwalkableIndexes);
    }

    public getTilemap(): Phaser.Tilemap
    {
        return this.tilemap;
    }

    public getGrounds(): Array<Array<number>>
    {
        return this.grounds;
    }

    public getTiles(): Array<Array<Phaser.Tile>>
    {
        return this.tiles;
    }

    public getTileSize(): number
    {
        return this.tilesize;
    }

    public getCollisionLayer(): Phaser.TilemapLayer
    {
        return this.collisionlayer;
    }

    public getWalkableIndexes() : Array<number>
    {
        return this.walkableIndexes;
    }

    public getUnwalkableIndexes() : Array<number>
    {
        return [
            1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15, // grass hills
            31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 44, 45, // grass brown rocks
            // 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70
            // 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96,
            // 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, // grass brown rocks
            112, 113, 114, 116, 118, 120, 121, 122, 125, 126, 129, 130, // grass brown rocks
            147, 148, 149, 150, 152, 153, 154, 155, 157, 158, 160, 161, // grass water
            162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 175, 176,// grass lava
            177, 178, 179, 185, 186, 188, 189, 190, // Grass deco
            200, 201, 202, 203, 204, 205 // Mountain deco
        ];
    }
}