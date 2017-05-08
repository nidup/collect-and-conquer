
export class PhaserPointPath
{
    private nodes :Phaser.Point[];

    public constructor(nodes: Phaser.Point[] = [])
    {
        this.nodes = nodes;
    }

    public getNodes() :Phaser.Point[]
    {
         return this.nodes;
    }
}
