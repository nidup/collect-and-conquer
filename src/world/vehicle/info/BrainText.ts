
import {Vehicle} from "../Vehicle";
import {StackFSM} from "../../../ai/fsm/StackFSM";
import {StateColors} from "./StateColor";
import {VehicleBrain} from "../brain/VehicleBrain";
import {TextStyle} from "../../../ui/TextStyle";

export class BrainText extends Phaser.Text
{
    private vehicle: Vehicle;
    private brain: VehicleBrain;
    private stateColors: StateColors;

    constructor(group: Phaser.Group, x: number, y: number, text: string, style, vehicle: Vehicle, brain: VehicleBrain)
    {
        super(group.game, x, y, text, style);
        this.brain = brain;
        this.vehicle = vehicle;
        this.stateColors = new StateColors();
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);
    }

    public update ()
    {
        this.setText(this.brain.getStateName());
        let color = this.stateColors.getColor(this.brain.getStateName());
        const textStyle = new TextStyle();
        this.setStyle(textStyle.getColorStyle(color));
        this.game.physics.arcade.moveToObject(this, this.vehicle, this.vehicle.body.speed);
    }

    public changeBrain(brain: VehicleBrain)
    {
        this.brain = brain;
    }
}