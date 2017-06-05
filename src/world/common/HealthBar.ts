
import {Vehicle} from "../vehicle/Vehicle";
import {HealthBarDrawer} from "./HealthBarDrawer";

export class HealthBar
{
    private game: Phaser.Game;
    private host: Phaser.Sprite;
    private bitmap: Phaser.BitmapData;
    private bar: Phaser.Sprite;
    private drawer: HealthBarDrawer;

    constructor(group: Phaser.Group, host: Phaser.Sprite)
    {
        this.game = group.game;
        this.host = host;

        const marginX = this.host.width / 2;
        const marginY = this.host.height / 2 + 10;
        this.bitmap = group.game.make.bitmapData(this.host.width, 4);
        this.bar = group.game.add.sprite(this.host.x - marginX, this.host.y + marginY, this.bitmap, 0, group);
        this.bar.anchor.set(0, 0);
        this.game.physics.enable(this.bar, Phaser.Physics.ARCADE);

        this.drawer = new HealthBarDrawer();
    }

    public update()
    {
        this.drawer.draw(this.host, this.bitmap, this.host.width);

        if (this.host instanceof Vehicle) {
            this.game.physics.arcade.moveToObject(this.bar, this.host, this.host.body.speed);
        }
    }

    public destroy()
    {
        this.bar.destroy();
        this.bitmap.destroy();
    }
}