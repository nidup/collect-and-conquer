
const SCALE_RATIO = 1.5;
const PANEL_WIDTH = 82;

export class CommandPanel extends Phaser.Sprite
{
    constructor(game: Phaser.Game, screenWidth: number)
    {
        super(game, screenWidth - (PANEL_WIDTH * SCALE_RATIO), 0, 'CommandsPanel', 0);

        this.fixedToCamera = true;
        this.scale.setTo(SCALE_RATIO, SCALE_RATIO);
        this.z = 100;

        game.add.existing(this);
    }
}
