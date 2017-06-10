
import {TextStyle} from "./TextStyle";
import {ButtonBuilder} from "./ButtonBuilder";
import {JukeBox} from "../world/audio/JukeBox";

export class MenuPanel
{
    private soundButton: Phaser.Button;

    constructor(group: Phaser.Group, panelWith: number, jukebox: JukeBox)
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
        let callback = function() {
            jukebox.switchSound();
        };
        this.soundButton = buttonBuilder.addButton(group, positionX, positionY, frame, 'Sound', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() {
            jukebox.switchMusic();
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
    }
}