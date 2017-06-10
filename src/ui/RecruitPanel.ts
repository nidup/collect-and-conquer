
import {Player} from "../game/player/Player";
import {Base} from "../world/building/Base";
import {VehicleCosts} from "../world/vehicle/VehicleCosts";
import {Scout} from "../world/vehicle/Scout";
import {Miner} from "../world/vehicle/Miner";
import {Builder} from "../world/vehicle/Builder";
import {Tank} from "../world/vehicle/Tank";
import {TextStyle} from "./TextStyle";

export class RecruitPanel
{
    private base: Base;
    private vehicleCosts: VehicleCosts;
    private totalStock: Phaser.Text;
    private minerButton: Phaser.Button;
    private scoutButton: Phaser.Button;
    private builderButton: Phaser.Button;
    private tankButton: Phaser.Button;
    private textStyle: TextStyle;

    constructor(group: Phaser.Group, player: Player, positionY: number)
    {
        const buttonHeight = 27;
        const verticalMargin = 5;
        const base = player.getArmy().getBase();
        this.base = base;
        this.vehicleCosts = new VehicleCosts();
        this.textStyle = new TextStyle();

        this.totalStock = this.addCostTextAndImage(group, positionY, base.getStock());
        group.game.add.text(group.game.width - 125, positionY+2, 'Total', this.textStyle.getNormalStyle(), group);

        positionY += 74;
        group.game.add.text(group.game.width - 210, positionY, 'Recruitment', this.textStyle.getNormalStyle(), group);

        positionY += 28;
        let callback = function() {
            base.buildMiner();
        };
        this.minerButton = this.addRecruitButton(group, positionY, 'Miner', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Miner));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildScout();
        };
        this.scoutButton = this.addRecruitButton(group, positionY, 'Scout', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Scout));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildBuilder();
        };
        this.builderButton = this.addRecruitButton(group, positionY, 'Builder', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Builder));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildTank();
        };
        this.tankButton = this.addRecruitButton(group, positionY, 'Tank', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Tank));
    }

    public update()
    {
        this.totalStock.setText(this.base.getStock().toString());

        if (this.base.getStock() >= this.vehicleCosts.getCost(Miner)) {
            this.enableButton(this.minerButton);
        } else {
            this.disableButton(this.minerButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Scout)) {
            this.enableButton(this.scoutButton);
        } else {
            this.disableButton(this.scoutButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Builder)) {
            this.enableButton(this.builderButton);
        } else {
            this.disableButton(this.builderButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Tank)) {
            this.enableButton(this.tankButton);
        } else {
            this.disableButton(this.tankButton);
        }
    }

    private addRecruitButton(group: Phaser.Group, positionY: number, buttonText: string, callback :Function): Phaser.Button
    {
        const buttonWidth = 140;
        const buttonMargin = 7;

        let buttonX = group.game.width - buttonWidth - buttonMargin;
        let buttonY = positionY;
        const button = group.game.add.button(
            buttonX,
            buttonY,
            'BuyButton',
            callback,
            this,
            4,
            3,
            4,
            3,
            group
        );

        const textMarginX = 15;
        const textMarginY = 3;
        const styleNormal = this.textStyle.getNormalStyle();
        const styleHover =  this.textStyle.getOverStyle();
        const text = group.game.add.text(buttonX + textMarginX, buttonY + textMarginY, buttonText, styleNormal, group);
        button.onInputOut.add(function () {
            text.setStyle(styleNormal);
            text.y = text.y - 1;
        });
        button.onInputOver.add(function () {
            text.setStyle(styleHover);
            text.y = text.y + 1;
        });

        return button;
    }

    private addCostTextAndImage(group: Phaser.Group, positionY: number, cost: number): Phaser.Text
    {
        const txtPositionX = group.game.width - 200;
        const txtPositionY = positionY + 3;
        const text = group.game.add.text(txtPositionX, txtPositionY, cost.toString(), this.textStyle.getNormalStyle(), group);
        const oilPositionX = txtPositionX - 37;
        const oilPositionY = txtPositionY - 2;
        group.game.add.image(oilPositionX, oilPositionY, 'Icons', 33, group);

        return text;
    }

    private enableButton(button: Phaser.Button)
    {
        button.setFrames(4, 3, 4);
    }

    private disableButton(button: Phaser.Button)
    {
        button.setFrames(6, 5, 6);
    }
}