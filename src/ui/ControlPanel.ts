
import {UnitSelector} from "./UnitSelector";
import {Vehicle} from "../world/vehicle/Vehicle";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
import {StateColors} from "../world/vehicle/StateColor";
import {CommandPanel} from "./CommandPanel";
import {Player} from "../game/player/Player";

const SCALE_RATIO = 1.5; // TODO: rework sprite and avoid this ratio!
const PANEL_WIDTH = 82;

export class ControlPanel extends Phaser.Sprite
{
    private screenWidth: number;
    private unitSelector: UnitSelector;
    private camera: Phaser.Camera;
    private unitStateText: Phaser.Text;
    private stateColors: StateColors;
    private unitStateImage: Phaser.Sprite;
    private commandPannel: CommandPanel;

    constructor(game: Phaser.Game, screenWidth: number, unitSelector: UnitSelector, player: Player)
    {
        super(game, screenWidth - (PANEL_WIDTH * SCALE_RATIO), 0, 'ControlPanel', 0);

        this.screenWidth = screenWidth;
        this.fixedToCamera = true;
        this.scale.setTo(SCALE_RATIO, SCALE_RATIO);
        this.z = 100;

        game.add.existing(this);

        this.unitSelector = unitSelector;
        this.camera = game.camera;

        const unitBackground = this.game.add.sprite(screenWidth - 104, 14, 'UnitBackground', 0);
        unitBackground.fixedToCamera = true;
        unitBackground.scale.setTo(SCALE_RATIO, SCALE_RATIO);
        unitBackground.z = 50;

        this.unitStateText = this.game.add.text(screenWidth - 100, 115, '', {});
        this.unitStateText.fixedToCamera = true;

        this.stateColors = new StateColors();

        this.commandPannel = new CommandPanel(this.game, player);
    }

    public update ()
    {
        const selectedUnit = this.unitSelector.getSelectedUnit();
        if (selectedUnit) {
            this.camera.follow(selectedUnit);
            this.displayUnitStatus(selectedUnit);
            this.copySelectedUnitImage(selectedUnit);
        }
    }

    private displayUnitStatus(selectedUnit: Phaser.Sprite)
    {
        if (selectedUnit instanceof Building || selectedUnit instanceof Vehicle || selectedUnit instanceof Item) {
            this.unitStateText.setText(selectedUnit.getStatus());
            const color = this.stateColors.getColor(selectedUnit.getStatus());
            const style = {font: "11px Arial", fill: color, boundsAlignH: "center", boundsAlignV: "top"};
            this.unitStateText.setStyle(style);
        }
    }

    private copySelectedUnitImage(selectedUnit: Phaser.Sprite)
    {
        const oldImage = this.unitStateImage;
        this.game.world.children = this.game.world.children.reduce(
            function (children, object) {
                if (object != oldImage ) {
                    children.push(object);
                }
                return children;
            },
            []
        );

        let positionX = this.screenWidth - 103;
        positionX += (selectedUnit instanceof Vehicle) ? 30 : 0;
        positionX += (selectedUnit instanceof Building) ? 20 : 0;
        positionX += (selectedUnit instanceof Item) ? 30 : 0;

        let positionY = 14;
        positionY += (selectedUnit instanceof Vehicle) ? 40 : 0;
        positionY += (selectedUnit instanceof Building) ? 10 : 0;
        positionY += (selectedUnit instanceof Item) ? 35 : 0;

        this.unitStateImage = this.game.add.sprite(positionX, positionY, selectedUnit.key, selectedUnit.frame);
        this.unitStateImage.fixedToCamera = true;
        this.unitStateImage.animations = selectedUnit.animations;
        this.unitStateImage.tint = selectedUnit.tint;
        if (selectedUnit.animations.currentAnim) {
            this.unitStateImage.animations.play(selectedUnit.animations.currentAnim.name);
        }
        this.unitStateImage.scale.setTo(1.3, 1.3);

        // TODO: issue when following a miner that build a mine and destroy itself
        /*
        if (selectedUnit instanceof Vehicle) {
            this.unitStateImage.angle = 180 + Phaser.Math.radToDeg(
                Phaser.Point.angle(
                    selectedUnit.getPosition(),
                    new Phaser.Point(
                        selectedUnit.getPosition().x + selectedUnit.getVelocity().x,
                        selectedUnit.getPosition().y + selectedUnit.getVelocity().y
                    )
                )
            );
        }*/
    }
}