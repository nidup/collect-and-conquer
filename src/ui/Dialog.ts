
import {TextStyle} from "./TextStyle";
import {ButtonAndText, ButtonBuilder} from "./ButtonBuilder";

abstract class Dialog
{
    private background: Phaser.Sprite;
    private text: Phaser.Text;
    protected button: ButtonAndText;
    protected dialogX: number;
    protected dialogY: number;

    public constructor(group: Phaser.Group, content: string)
    {
        const game = group.game;
        const dialogWidth = 312;
        const dialogHeight = 195;
        this.dialogX = game.width / 2 - dialogWidth / 2;
        this.dialogY =  game.height / 2 - dialogHeight / 2;
        const textStyle = new TextStyle();
        this.background = group.game.add.sprite(this.dialogX, this.dialogY, 'Dialog', 0, group);
        const textMarginX = 35;
        const textMarginY = 35;
        this.text = group.game.add.text(this.dialogX + textMarginX, this.dialogY + textMarginY, content, textStyle.getNormalStyle(22), group);
    }

    public destroy()
    {
        this.background.destroy();
        this.text.destroy();
        this.button.getButton().destroy();
        this.button.getText().destroy();
    }
}

export class VictoryDialog extends Dialog
{
    public constructor(group: Phaser.Group)
    {
        super(group, "Victory!\n\nYou destroyed all your\nenemy's buildings!");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder();
        const myself = this;
        const callback = function() {
            myself.destroy();
            game.paused = false;
            game.state.start('Play');
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY+160, 6, 'Restart', callback);
    }
}

export class DefeatDialog extends Dialog
{
    public constructor(group: Phaser.Group)
    {
        super(group, "Defeat!\n\nAll your buildings\nhave been destroyed");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder();
        const myself = this;
        const callback = function() {
            myself.destroy();
            game.paused = false;
            game.state.start('Play');
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY+160, 6, 'Restart', callback);
    }
}

export class NewGameDialog extends Dialog
{
    public constructor(group: Phaser.Group)
    {
        super(group, "Destroy all enemy's\nbuildings to defeat\nhim and escape\nthis planet");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder();
        const myself = this;
        const callback = function() {
            myself.destroy();
            game.paused = false;
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY+160, 6, 'Start', callback);
    }
}
