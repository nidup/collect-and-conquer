
import {UnitSelector} from "./UnitSelector";
import {Vehicle} from "../world/vehicle/Vehicle";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
import {RecruitPanel} from "./RecruitPanel";
import {Player} from "../game/player/Player";
import {TextStyle} from "./TextStyle";

export class ControlPanel extends Phaser.Sprite
{
    private screenWidth: number;
    private unitSelector: UnitSelector;
    private camera: Phaser.Camera;
    private unitStateText: Phaser.Text;
    private unitStateImage: Phaser.Sprite;
    private commandPannel: RecruitPanel;
    private textStyle: TextStyle;

    constructor(game: Phaser.Game, screenWidth: number, panelWidth: number, unitSelector: UnitSelector, player: Player)
    {
        super(game, screenWidth - panelWidth, 0, 'CommandPanel', 0);

        this.screenWidth = screenWidth;
        this.fixedToCamera = true;
        this.z = 100;
        this.textStyle = new TextStyle();

        game.add.existing(this);

        this.unitSelector = unitSelector;
        this.camera = game.camera;

        this.unitStateText = this.game.add.text(screenWidth - 150, 241, '', {});
        this.unitStateText.fixedToCamera = true;

        this.commandPannel = new RecruitPanel(this.game, player);
    }

    public update ()
    {
        const selectedUnit = this.unitSelector.getSelectedUnit();
        if (selectedUnit) {
            this.camera.follow(selectedUnit);
            this.displayUnitStatus(selectedUnit);
            this.copySelectedUnitImage(selectedUnit);
        }

        this.commandPannel.update();
    }

    private displayUnitStatus(selectedUnit: Phaser.Sprite)
    {
        if (selectedUnit instanceof Building || selectedUnit instanceof Vehicle || selectedUnit instanceof Item) {
            this.unitStateText.setText(selectedUnit.getStatus());
            this.unitStateText.setStyle(this.textStyle.getNormalStyle());
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

        let positionX = this.screenWidth - 240;
        positionX += (selectedUnit instanceof Vehicle) ? 30 : 0;
        positionX += (selectedUnit instanceof Building) ? 20 : 0;
        positionX += (selectedUnit instanceof Item) ? 30 : 0;

        let positionY = 235;
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
