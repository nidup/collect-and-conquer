
import {TextStyle} from "./TextStyle";

export class ButtonAndText
{
    private button: Phaser.Button;
    private text: Phaser.Text;

    public constructor(button: Phaser.Button, text: Phaser.Text)
    {
        this.button = button;
        this.text = text;
    }

    public getButton(): Phaser.Button
    {
        return this.button;
    }

    public getText(): Phaser.Text
    {
        return this.text;
    }
}

export class ButtonBuilder
{
    public addButton(group: Phaser.Group, positionX: number, positionY: number, buttonFrame : number, buttonText: string, callback :Function): ButtonAndText
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
        const textMarginX = 15;
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

        return new ButtonAndText(button, text);
    }
}
