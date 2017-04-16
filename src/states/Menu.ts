
import {Hero} from "../Hero";

export default class Menu extends Phaser.State {

    private titleText : Phaser.BitmapText;
    private subtitleText : Phaser.BitmapText;
    private briefingTextLine1 : Phaser.BitmapText;
    private briefingTextLine2 : Phaser.BitmapText;
    private startText : Phaser.BitmapText;
    private coin1: Phaser.Sprite;
    private coin2: Phaser.Sprite;
    private hero: Phaser.Sprite;
    private nude: Phaser.Sprite;
    private gnome: Phaser.Sprite;
    private commandText : Phaser.BitmapText;

    public create ()
    {
        this.game.stage.backgroundColor = '#1b1128';

        let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);

        this.titleText = this.game.add.bitmapText(40, 100, 'carrier-command','Underpants Gnomes', 27);
        this.subtitleText = this.game.add.bitmapText(40, 140, 'carrier-command','Akeneo Game Jam #3 by nidup', 10);

        this.hero = this.game.add.sprite(40, 180, 'king', 0);
        this.hero.animations.add('dancing', [0, 1, 2, 3, 18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
        this.hero.play('dancing');

        this.gnome = this.game.add.sprite(390, 180, 'gnome', 0);
        this.gnome.animations.add('dancing', [0, 1, 2, 3, 18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
        this.gnome.play('dancing');

        this.nude = this.game.add.sprite(730, 180, 'nude', 0);
        this.nude.animations.add('dancing', [0, 1, 2, 3, 18, 19, 20, 21, 22, 23, 24, 25, 26], 10, true);
        this.nude.play('dancing');

        this.briefingTextLine1 = this.game.add.bitmapText(40, 250, 'carrier-command','As the king of gnomes, your plan is,', 15);
        this.briefingTextLine2 = this.game.add.bitmapText(40, 290, 'carrier-command','A) Collect underpants\n\nB) ? \n\nC) Profit', 15);

        this.commandText = this.game.add.bitmapText(90, 410, 'carrier-command','Use left / right keys to move and space bar to jump', 10);

        this.startText = this.game.add.bitmapText(240, 450, 'carrier-command','Press space to start', 10);

        this.coin1 = this.game.add.sprite(200, 447, 'coin', 0);
        this.coin1.animations.add('flip', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.coin1.play('flip');

        this.coin2 = this.game.add.sprite(500, 447, 'coin', 0);
        this.coin2.animations.add('flip', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.coin2.play('flip');
    }

    public startGame ()
    {
        this.game.state.start('Play');
    }

    public shutdown ()
    {
        this.titleText.destroy();
        this.subtitleText.destroy();
        this.briefingTextLine1.destroy();
        this.briefingTextLine2.destroy();
        this.startText.destroy();
        this.commandText.destroy();
        this.coin1.destroy();
        this.coin2.destroy();
        this.hero.destroy();
        this.gnome.destroy();
        this.nude.destroy();
    }
}
