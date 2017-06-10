
import {TextStyle} from "./TextStyle";
import {ButtonBuilder} from "./ButtonBuilder";

export class Dialog
{
    private background: Phaser.Sprite;
    private text: Phaser.Text;
    private button: Phaser.Button;

    public constructor(group: Phaser.Group, content: string)
    {
        const game = group.game;
        const dialogWidth = 312;
        const dialogHeight = 195;
        const dialogX = game.width / 2 - dialogWidth / 2;
        const dialogY =  game.height / 2 - dialogHeight / 2;
        const textStyle = new TextStyle();
        this.background = group.game.add.sprite(dialogX, dialogY, 'Dialog', 0, group);
        const textMarginX = 35;
        const textMarginY = 35;
        this.text = group.game.add.text(dialogX + textMarginX, dialogY + textMarginY, content, textStyle.getNormalStyle(22), group);

        const buttonBuilder = new ButtonBuilder();
        const myself = this;
        const callback = function() {
            myself.destroy();
            game.paused = false;
            game.state.start('Play');
        };
        this.button = buttonBuilder.addButton(group, dialogX + 185, dialogY+160, 6, 'Restart', callback);
    }

    public destroy()
    {
        this.background.destroy();
        this.text.destroy();
        this.button.destroy();
    }
}