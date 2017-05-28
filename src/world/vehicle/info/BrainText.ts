
import {Vehicle} from "../Vehicle";
import {StackFSM} from "../../../ai/fsm/StackFSM";
import {StateColors} from "../StateColor";

export class BrainText extends Phaser.Text
{
    private vehicle: Vehicle;
    private brain: StackFSM;
    private stateColors: StateColors;

    constructor(game: Phaser.Game, x: number, y: number, text: string, style, vehicle: Vehicle, brain: StackFSM)
    {
        super(game, x, y, text, style);
        this.vehicle = vehicle;
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
        this.game.physics.arcade.moveToXY(this, this.vehicle.body.x, this.vehicle.body.y -20, this.vehicle.body.speed);
    }
}