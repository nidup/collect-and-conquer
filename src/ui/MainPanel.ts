
import {UnitSelector} from "./UnitSelector";
import {Player} from "../game/player/Player";
import {ControlPanel} from "./ControlPanel";
import {OrderPanel} from "./OrderPanel";

export class MainPanel
{
    private game: Phaser.Game;
    private unitSelector: UnitSelector;
    private health: Phaser.Graphics;
    private screenWidth: number

    constructor(game: Phaser.Game, screenWidth: number, panelWith: number, unitSelector: UnitSelector, player: Player)
    {
        this.game = game;
        this.screenWidth = screenWidth;
        this.unitSelector = unitSelector;

        const rectX = 200;
        const rectY = 10;
        const rectWidth = 70;
        const rectHeight = 17;
        this.health = this.game.add.graphics(this.getHealthBarPositionX(), 302);
        this.health.beginFill(0x00FF00, 1);
        this.health.drawRect(rectX, rectY, this.getHealthBarWidth(rectWidth), rectHeight);
        this.health.endFill();
        this.health.z = 200;

        new ControlPanel(game, screenWidth, panelWith, unitSelector, player);
        new OrderPanel(game, screenWidth, panelWith, player);
    }

    public update()
    {
        // TODO fix this!
    }

    private getHealthBarPositionX()
    {
        return this.screenWidth - 435;
    }

    private getHealthBarWidth(maxWidth: number)
    {
        const host = this.unitSelector.getSelectedUnit();
        const healthRatio = host.health / host.maxHealth;
        const healthWidth = maxWidth * healthRatio;

        return healthWidth;
    }
}