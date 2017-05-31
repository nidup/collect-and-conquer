
import {UnitSelector} from "./UnitSelector";
import {Player} from "../game/player/Player";
import {ControlPanel} from "./ControlPanel";

export class MainPanel
{
    private unitSelector: UnitSelector;
    private health: Phaser.Graphics;
    private screenWidth: number

    constructor(game: Phaser.Game, screenWidth: number, panelWith: number, unitSelector: UnitSelector, player: Player)
    {
        this.screenWidth = screenWidth;
        this.unitSelector = unitSelector;
        const rectX = 200;
        const rectY = 10;
        const rectWidth = 70;
        const rectHeight = 17;

        this.health = game.add.graphics(this.getHealthBarPositionX(), 302);
        this.health.beginFill(0x00FF00, 1);
        this.health.drawRect(rectX, rectY, rectWidth, rectHeight);
        this.health.z = 200;

        new ControlPanel(game, screenWidth, panelWith, unitSelector, player);
    }

    public update()
    {
        this.health.x = this.getHealthBarPositionX();
        this.health.width = this.getHealthBarWidth();
    }

    private getHealthBarPositionX()
    {
        return this.screenWidth - 435;
    }

    private getHealthBarWidth()
    {
        const host = this.unitSelector.getSelectedUnit();
        const healthRatio = host.health / host.maxHealth;
        const healthWidth = 70 * healthRatio;

        return healthWidth;
    }
}