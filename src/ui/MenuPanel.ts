
import {TextStyle} from "./TextStyle";
import {ButtonBuilder} from "./ButtonBuilder";

export class MenuPanel
{
    private soundOn: boolean = true;
    private soundButton: Phaser.Button;

    constructor(group: Phaser.Group, panelWith: number)
    {
        const screenWidth = group.game.width;
        const textStyle = new TextStyle();
        let positionY = 650;

        group.game.add.text(screenWidth - 210, positionY, 'Menu', textStyle.getNormalStyle(), group);

        const buttonBuilder = new ButtonBuilder();

        const buttonHeight = 27;
        const verticalMargin = 3;
        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;
        const leftPositionX = screenWidth - panelWith + marginX;
        let positionX = leftPositionX;
        positionY += 30;
        let frame = 4;
        const myself = this;
        let callback = function() {
            console.log('switch');
            myself.soundOn = !myself.soundOn;
        };
        this.soundButton = buttonBuilder.addButton(group, positionX, positionY, frame, 'Sound', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() {
            console.log('switch');
        };
        buttonBuilder.addButton(group, positionX, positionY, 8, 'Music', callback);

        positionY += buttonHeight + verticalMargin;
        positionX = leftPositionX;
        const game = group.game;
        callback = function() {
            game.paused = !game.paused;
        };
        buttonBuilder.addButton(group, positionX, positionY, 10, 'Pause', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() {
            game.state.start('Play');
        };
        buttonBuilder.addButton(group, positionX, positionY, 6, 'Restart', callback);

        // TODO: enable / disable button
    }

    public update()
    {
        if (this.soundOn) {
            this.enableButton(this.soundButton);
        } else {
            this.disableButton(this.soundButton);
        }
    }

    private enableButton(button: Phaser.Button)
    {
        button.setFrames(4, 3, 4);
    }

    private disableButton(button: Phaser.Button)
    {
        button.setFrames(6, 5, 6);
    }
}