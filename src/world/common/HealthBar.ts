
import Physics = Phaser.Physics;
import {Mine} from "../building/Mine";
import {Vehicle} from "../vehicle/Vehicle";
export class HealthBar
{
    private game: Phaser.Game;
    private host: Phaser.Sprite;
    private background: Phaser.Graphics;
    private foreground: Phaser.Graphics;
    private healthOkColor: number = 0x00FF00;
    private healthKoColor: number = 0xFF0000;


    constructor(game: Phaser.Game, host: Phaser.Sprite)
    {
        this.game = game
        this.host = host;

        const rectX = -this.host.width / 2;
        const rectY = this.host.height / 2 + 10;
        const rectWidth = this.host.width;
        const rectHeight = 4;

        this.background = game.add.graphics(this.host.x, this.host.y);
        this.background.beginFill(0x040404, 1);
        this.background.drawRect(rectX, rectY, rectWidth, rectHeight);
        this.game.physics.enable(this.background, Phaser.Physics.ARCADE);

        this.foreground = game.add.graphics(this.host.x, this.host.y);
        this.foreground.beginFill(this.healthOkColor, 1);
        this.foreground.drawRect(rectX, rectY, this.getHealthBarWidth(), rectHeight);
        this.game.physics.enable(this.foreground, Phaser.Physics.ARCADE);
    }

    public update()
    {
        this.foreground.width = this.getHealthBarWidth();

        if (this.host instanceof Vehicle) {
            this.game.physics.arcade.moveToObject(this.background, this.host);
            this.game.physics.arcade.moveToObject(this.foreground, this.host);
        }
    }

    public destroy()
    {
        this.background.destroy();
        this.foreground.destroy();
    }

    private getHealthBarWidth()
    {
        const healthRatio = this.host.health / this.host.maxHealth;
        const healthWidth = this.host.width * healthRatio;

        return healthWidth;
    }
}