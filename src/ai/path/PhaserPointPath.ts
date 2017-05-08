
export class PhaserPointPath
{
    private nodes :Phaser.Point[];

    public constructor()
    {
        this.nodes = [];
    }

    public getNodes() :Phaser.Point[]
    {
         return this.nodes;
    }
}
