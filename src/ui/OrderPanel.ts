
import {Player} from "../game/player/Player";
import {TextStyle} from "./TextStyle";

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

        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;

        let positionX = screenWidth - panelWith + marginX;
        positionY += 30;
        let callback = function() { player.getArmy().getStrategy().defend(); };
        this.addOrderButton(group, positionX, positionY, 0, 'Defend', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() { player.getArmy().getStrategy().attack(); };
        this.addOrderButton(group, positionX, positionY, 2, 'Attack', callback);

        // TODO: enable / disable button

    }

    private addOrderButton(group: Phaser.Group, positionX: number, positionY: number, buttonFrame : number, buttonText: string, callback :Function): Phaser.Button
    {
        let buttonX = positionX;
        let buttonY = positionY;
        const button = group.game.add.button(
            buttonX,
            buttonY,
            'OrderButton',
            callback,
            this,
            buttonFrame+1,
            buttonFrame,
            buttonFrame+1,
            buttonFrame,
            group
        );

        const textMarginY = 3;
        const textMarginX = 10;
        const styleNormal = this.textStyle.getNormalStyle();
        const styleHover =  this.textStyle.getOverStyle();
        const text = group.game.add.text(buttonX + textMarginX, buttonY + textMarginY, buttonText, styleNormal, group);
        button.onInputOut.add(function () {
            text.setStyle(styleNormal);
            text.y = text.y - 1;
        });
        button.onInputOver.add(function () {
            text.setStyle(styleHover);
            text.y = text.y + 1;
        });

        return button;
    }
}