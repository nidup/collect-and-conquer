
import {Vehicle} from "./Vehicle";
import {StackFSM} from "../../ai/fsm/StackFSM";
import {StateColors} from "./StateColor";

export class BrainText extends Phaser.Text
{
    private bot: Vehicle;
    private brain: StackFSM;
    private stateColors: StateColors;

    constructor(game: Phaser.Game, x: number, y: number, text: string, style, bot: Vehicle, brain: StackFSM)
    {
        super(game, x, y, text, style);
        this.bot = bot;
        this.brain = brain;
        this.stateColors = new StateColors();
        game.physics.enable(this, Phaser.Physics.ARCADE);
        game.add.existing(this);
    }

    public update ()
    {
        this.setText(this.brain.getCurrentState().getName());
        let color = this.stateColors.getColor(this.brain.getCurrentState().getName());
        const style = {font: "13px Arial", fill: color, boundsAlignH: "center", boundsAlignV: "top"};
        this.setStyle(style);
        this.game.physics.arcade.moveToXY(this, this.bot.body.x, this.bot.body.y -20, this.bot.body.speed);
    }
}