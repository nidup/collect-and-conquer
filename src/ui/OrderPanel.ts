
import {Player} from "../game/player/Player";
import {TextStyle} from "./TextStyle";
import {ButtonBuilder} from "./ButtonBuilder";

export class OrderPanel
{
    private screenWidth: number;
    private textStyle: TextStyle;

    constructor(group: Phaser.Group, screenWidth: number, panelWith: number, player: Player)
    {
        this.screenWidth = screenWidth;
        this.textStyle = new TextStyle();
        let positionY = 565;

        group.game.add.text(screenWidth - 210, positionY, 'Strategies', this.textStyle.getNormalStyle(), group);

        const buttonBuilder = new ButtonBuilder();
        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;

        let positionX = screenWidth - panelWith + marginX;
        positionY += 30;
        let callback = function() { player.getArmy().getStrategy().defend(); };
        buttonBuilder.addButton(group, positionX, positionY, 0, 'Defend', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() { player.getArmy().getStrategy().attack(); };
        buttonBuilder.addButton(group, positionX, positionY, 2, 'Attack', callback);

        // TODO: enable / disable button
    }
}