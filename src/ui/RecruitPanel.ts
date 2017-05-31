
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
    private minerButton: Phaser.Button;
    private scoutButton: Phaser.Button;
    private builderButton: Phaser.Button;
    private tankButton: Phaser.Button;
    private textStyle: TextStyle;

    constructor(game: Phaser.Game, player: Player)
    {
        let positionY = 400;
        const buttonHeight = 27;
        const verticalMargin = 5;
        const base = player.getArmy().getBase();
        this.base = base;
        this.vehicleCosts = new VehicleCosts();
        this.textStyle = new TextStyle();

        let callback = function() {
            base.buildMiner();
        };
        this.minerButton = this.addRecruitButton(game, positionY, 'Recruit Miner', callback);
        this.addCostTextAndImage(game, positionY, this.vehicleCosts.getCost(Miner));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildScout();
        };
        this.scoutButton = this.addRecruitButton(game, positionY, 'Recruit Scout', callback);
        this.addCostTextAndImage(game, positionY, this.vehicleCosts.getCost(Scout));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildBuilder();
        };
        this.builderButton = this.addRecruitButton(game, positionY, 'Recruit Builder', callback);
        this.addCostTextAndImage(game, positionY, this.vehicleCosts.getCost(Builder));

        positionY += buttonHeight + verticalMargin;
        callback = function() {
            base.buildTank();
        };
        this.tankButton = this.addRecruitButton(game, positionY, 'Recruit Tank', callback);
        this.addCostTextAndImage(game, positionY, this.vehicleCosts.getCost(Tank));
    }

    public update()
    {
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

    private addRecruitButton(game: Phaser.Game, positionY: number, buttonText: string, callback :Function): Phaser.Button
    {
        const buttonWidth = 140;
        const buttonMargin = 7;

        let buttonX = game.width - buttonWidth - buttonMargin;
        let buttonY = positionY;
        const button = game.add.button(
            buttonX,
            buttonY,
            'BuyButton',
            callback,
            this, 4, 3, 4
        );

        const textMargin = 3;
        const styleNormal = this.textStyle.getNormalStyle();
        const styleHover =  this.textStyle.getOverStyle();
        const text = game.add.text(buttonX + textMargin, buttonY + textMargin, buttonText, styleNormal);
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

    private addCostTextAndImage(game: Phaser.Game, positionY: number, cost: number)
    {
        const txtPositionX = game.width - 200;
        const txtPositionY = positionY + 3;
        game.add.text(txtPositionX, txtPositionY, cost.toString(), this.textStyle.getNormalStyle());
        const oilPositionX = txtPositionX - 37;
        const oilPositionY = txtPositionY - 2;
        game.add.image(oilPositionX, oilPositionY, 'Icons', 33);
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