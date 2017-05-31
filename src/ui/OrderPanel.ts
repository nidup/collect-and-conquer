
import {Player} from "../game/player/Player";
import {TextStyle} from "./TextStyle";

export class OrderPanel
{
    private game: Phaser.Game;
    private screenWidth: number;
    private textStyle: TextStyle;

    constructor(game: Phaser.Game, screenWidth: number, panelWith: number, player: Player)
    {
        this.game = game;
        this.screenWidth = screenWidth;
        this.textStyle = new TextStyle();
        let positionY = 565;

        this.game.add.text(screenWidth - 210, positionY, 'Strategies', this.textStyle.getNormalStyle());

        const buttonWidth = 110;
        const buttonMargin = 7;

        let positionX = screenWidth - 233;
        positionY += 30;
        let callback = function() { console.log('test'); };
        this.addOrderButton(game, positionX, positionY, 0, 'Defend', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() { console.log('test'); };
        this.addOrderButton(game, positionX, positionY, 2, 'Attack', callback);

    }

    private addOrderButton(game: Phaser.Game, positionX: number, positionY: number, buttonFrame : number, buttonText: string, callback :Function): Phaser.Button
    {
        let buttonX = positionX;
        let buttonY = positionY;
        const button = game.add.button(
            buttonX,
            buttonY,
            'OrderButton',
            callback,
            this, buttonFrame+1, buttonFrame, buttonFrame+1
        );

        const textMarginY = 3;
        const textMarginX = 10;
        const styleNormal = this.textStyle.getNormalStyle();
        const styleHover =  this.textStyle.getOverStyle();
        const text = game.add.text(buttonX + textMarginX, buttonY + textMarginY, buttonText, styleNormal);
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