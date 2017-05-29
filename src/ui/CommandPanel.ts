
import {Player} from "../game/player/Player";

export class CommandPanel
{
    constructor(game: Phaser.Game, player: Player)
    {
        let positionY = 350;
        const buttonHeight = 27;
        const verticalMargin = 5;

        let callback = function() { player.getArmy().recruitMiner(100, 100); };
        this.addButton(game, positionY, 'Recruit Miner', callback);

        positionY += buttonHeight + verticalMargin;
        callback = function() { player.getArmy().recruitScout(100, 100); };
        this.addButton(game, positionY, 'Recruit Scout', callback);

        positionY += buttonHeight + verticalMargin;
        callback = function() { player.getArmy().recruitBuilder(100, 100); };
        this.addButton(game, positionY, 'Recruit Builder', callback);

        positionY += buttonHeight + verticalMargin;
        callback = function() { player.getArmy().recruitTank(100, 100); };
        this.addButton(game, positionY, 'Recruit Tank', callback);
    }

    private addButton(game: Phaser.Game, positionY: number, buttonText: string, callback :Function)
    {
        const buttonWidth = 94;
        const buttonMargin = 10;
        const colorNormal = '#8cd6ff';
        const colorHover = '#5a7086';

        let buttonX = game.width - buttonWidth - buttonMargin;
        let buttonY = positionY;
        const button = game.add.button(
            buttonX,
            buttonY,
            'Button',
            callback,
            this, 1, 0, 1
        );

        const textMargin = 3;
        const styleNormal = { font: "14px Arial", fill: colorNormal, align: "center" };
        const styleHover =  { font: "14px Arial", fill: colorHover, align: "center" };
        const text = game.add.text(buttonX + textMargin, buttonY + textMargin, buttonText, styleNormal);
        button.onInputOut.add(function () {
            text.setStyle(styleNormal);
            text.y = text.y - 1;
        });
        button.onInputOver.add(function () {
            text.setStyle(styleHover);
            text.y = text.y + 1;
        });
    }
}