
import {TextStyle} from "./TextStyle";

export class ButtonBuilder
{
    public addButton(group: Phaser.Group, positionX: number, positionY: number, buttonFrame : number, buttonText: string, callback :Function): Phaser.Button
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

        const textStyle = new TextStyle();
        const textMarginY = 3;
        const textMarginX = 10;
        const styleNormal = textStyle.getNormalStyle();
        const styleHover =  textStyle.getOverStyle();
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