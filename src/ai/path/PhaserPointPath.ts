
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

    public lastNode() : Phaser.Point
    {
        return this.nodes.length > 0 ? this.nodes[this.nodes.length-1] : null;
    }
}
