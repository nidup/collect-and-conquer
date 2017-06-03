
import {Vehicle} from "../Vehicle";
import {StackFSM} from "../../../ai/fsm/StackFSM";
import {StateColors} from "./StateColor";
import {VehicleBrain} from "../brain/VehicleBrain";

export class BrainText extends Phaser.Text
{
    private vehicle: Vehicle;
    private brain: VehicleBrain;
    private stateColors: StateColors;

    constructor(game: Phaser.Game, x: number, y: number, text: string, style, vehicle: Vehicle, brain: VehicleBrain)
    {
        super(game, x, y, text, style);
        this.brain = brain;
        this.vehicle = vehicle;
        this.stateColors = new StateColors();
        game.physics.enable(this, Phaser.Physics.ARCADE);
        game.add.existing(this);
    }

    public update ()
    {
        this.setText(this.brain.getStateName());
        let color = this.stateColors.getColor(this.brain.getStateName());
        const style = {font: "13px Arial", fill: color, boundsAlignH: "center", boundsAlignV: "top"};
        this.setStyle(style);
        this.game.physics.arcade.moveToObject(this, this.vehicle, this.vehicle.body.speed);
    }

    public changeBrain(brain: VehicleBrain)
    {
        this.brain = brain;
    }
}