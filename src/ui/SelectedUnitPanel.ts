
import {UnitSelector} from "./UnitSelector";
import {Vehicle} from "../world/vehicle/Vehicle";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
import {TextStyle} from "./TextStyle";

export class SelectedUnitPanel
{
    private game: Phaser.Game;
    private panelWidth: number;
    private unitSelector: UnitSelector;
    private unitStateText: Phaser.Text;
    private unitStateImage: Phaser.Sprite;
    private textStyle: TextStyle;
    private health: Phaser.Graphics;

    constructor(game: Phaser.Game, panelWidth: number, unitSelector: UnitSelector)
    {
        this.game = game;
        this.panelWidth = panelWidth;
        this.textStyle = new TextStyle();
        this.unitSelector = unitSelector;
        let positionY = 190;
        this.unitStateText = this.game.add.text(this.game.width - 150, positionY, '', this.textStyle.getNormalStyle());
        this.unitStateText.fixedToCamera = true;

        positionY += 61;
        const rectX = 200;
        const rectY = 10;
        const rectWidth = 70;
        const rectHeight = 17;
        this.health = this.game.add.graphics(this.getHealthBarPositionX(), positionY);
        this.health.beginFill(0x00FF00, 1);
        this.health.drawRect(rectX, rectY, this.getHealthBarWidth(rectWidth), rectHeight);
        this.health.endFill();
        this.health.z = 200;

        positionY += 7;
        this.game.add.image(this.game.width - panelWidth, positionY, 'HealthJauge', 0);
    }

    public update ()
    {
        const selectedUnit = this.unitSelector.getSelectedUnit();
        if (selectedUnit) {
            this.displayUnitStatus(selectedUnit);
            this.copySelectedUnitImage(selectedUnit);
        }
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

        let positionX = this.game.width - this.panelWidth;
        positionX += (selectedUnit instanceof Vehicle) ? 30 : 0;
        positionX += (selectedUnit instanceof Building) ? 20 : 0;
        positionX += (selectedUnit instanceof Item) ? 30 : 0;

        let positionY = 184;
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
        // TODO: bug when select the mine during the building, infinite loop on building
    }

    private getHealthBarPositionX()
    {
        return this.game.width - 435;
    }

    private getHealthBarWidth(maxWidth: number) {
        const host = this.unitSelector.getSelectedUnit();
        const healthRatio = host.health / host.maxHealth;
        const healthWidth = maxWidth * healthRatio;

        return healthWidth;
    }
}
