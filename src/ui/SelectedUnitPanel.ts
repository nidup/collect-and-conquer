
import {UnitSelector} from "./UnitSelector";
import {Vehicle} from "../world/vehicle/Vehicle";
import {Building} from "../world/building/Building";
import {Item} from "../world/item/Item";
import {TextStyle} from "./TextStyle";
import {HealthBarDrawer} from "../world/common/HealthBarDrawer";

export class SelectedUnitPanel
{
    private group: Phaser.Group;
    private panelWidth: number;
    private unitSelector: UnitSelector;
    private unitStateText: Phaser.Text;
    private unitStateImage: Phaser.Sprite;
    private textStyle: TextStyle;
    private bitmap: Phaser.BitmapData;
    private drawer: HealthBarDrawer;

    constructor(group: Phaser.Group, panelWidth: number, unitSelector: UnitSelector)
    {
        this.panelWidth = panelWidth;
        this.textStyle = new TextStyle();
        this.unitSelector = unitSelector;
        let positionY = 190;
        this.unitStateText = group.game.add.text(group.game.width - 150, positionY, '', this.textStyle.getNormalStyle(), group);
        this.unitStateText.fixedToCamera = true;

        positionY += 67;
        const rectWidth = 70;
        const rectHeight = 17;
        const posX = group.game.width - panelWidth + 5;

        this.bitmap = group.game.make.bitmapData(rectWidth, rectHeight);
        const bar = group.game.add.sprite(posX, positionY, this.bitmap, 0, group);
        bar.anchor.set(0, 0);

        this.drawer = new HealthBarDrawer();
        group.game.add.image(group.game.width - panelWidth, positionY, 'HealthJauge', 0, group);

        this.group = group;
    }

    public update ()
    {
        const selectedUnit = this.unitSelector.getSelectedUnit();
        if (selectedUnit) {
            this.drawer.draw(selectedUnit, this.bitmap, this.bitmap.width);
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
        this.group.children = this.group.children.reduce(
            function (children, object) {
                if (object != oldImage ) {
                    children.push(object);
                }
                return children;
            },
            []
        );

        let positionX = this.group.game.width - this.panelWidth;
        positionX += (selectedUnit instanceof Vehicle) ? 30 : 0;
        positionX += (selectedUnit instanceof Building) ? 20 : 0;
        positionX += (selectedUnit instanceof Item) ? 30 : 0;

        let positionY = 184;
        positionY += (selectedUnit instanceof Vehicle) ? 40 : 0;
        positionY += (selectedUnit instanceof Building) ? 10 : 0;
        positionY += (selectedUnit instanceof Item) ? 35 : 0;

        this.unitStateImage = this.group.game.add.sprite(positionX, positionY, selectedUnit.key, selectedUnit.frame, this.group);
        this.unitStateImage.fixedToCamera = true;
        this.unitStateImage.animations = selectedUnit.animations;
        this.unitStateImage.tint = selectedUnit.tint;
        if (selectedUnit.animations.currentAnim) {
            this.unitStateImage.animations.play(selectedUnit.animations.currentAnim.name);
        }
        // TODO: bug when select the mine during the building, infinite loop on building
    }
}
