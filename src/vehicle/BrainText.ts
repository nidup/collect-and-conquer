
import {Bot} from "./Bot";
import {StackFSM} from "../ai/fsm/StackFSM";

export class BrainText extends Phaser.Text
{
    private bot: Bot;
    private brain: StackFSM;
    private stateColors: {} = {
        'wander': '#0000FF',
        'path following': '#00FF00'
    };

    constructor(game: Phaser.Game, x: number, y: number, text: string, style, bot: Bot, brain: StackFSM)
    {
        super(game, x, y, text, style);
        this.bot = bot;
        this.brain = brain;
        game.physics.enable(this, Phaser.Physics.ARCADE);
        game.add.existing(this);
    }

    public update ()
    {
        this.setText(this.brain.getCurrentState().getName());
        let color = this.stateColors[this.brain.getCurrentState().getName()];
        if (color == undefined) {
            color = '#FFFFFF';
        }

        const style = {font: "carrier-command", fill: color, boundsAlignH: "center", boundsAlignV: "top"};
        this.setStyle(style);
        this.game.physics.arcade.moveToXY(this, this.bot.body.x, this.bot.body.y -20);
    }
}