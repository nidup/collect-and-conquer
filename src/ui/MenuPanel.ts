
import {TextStyle} from "./TextStyle";
import {ButtonBuilder} from "./ButtonBuilder";

export class MenuPanel
{
    constructor(group: Phaser.Group, panelWith: number)
    {
        const screenWidth = group.game.width;
        const textStyle = new TextStyle();
        let positionY = 650;

        group.game.add.text(screenWidth - 210, positionY, 'Menu', textStyle.getNormalStyle(), group);

        const buttonBuilder = new ButtonBuilder();

        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;
        let positionX = screenWidth - panelWith + marginX;
        positionY += 30;
        let callback = function() { console.log('mute'); };
        buttonBuilder.addButton(group, positionX, positionY, 0, 'Mute', callback);

        positionX += buttonWidth + buttonMargin;
        callback = function() { console.log('restart'); };
        buttonBuilder.addButton(group, positionX, positionY, 2, 'Restart', callback);

        // TODO: enable / disable button

    }
}