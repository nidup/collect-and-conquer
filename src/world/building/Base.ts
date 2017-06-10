
import {Building} from "./Building";
import {Army} from "../Army";
import {VehicleCosts} from "../vehicle/VehicleCosts";
import {Miner} from "../vehicle/Miner";
import {Scout} from "../vehicle/Scout";
import {Builder} from "../vehicle/Builder";
import {Tank} from "../vehicle/Tank";

export class Base extends Building
{
    private stockedQuantity: number = 0;
    private vehicleCosts: VehicleCosts;

    constructor(group: Phaser.Group, x: number, y: number, army: Army, key: string, frame: number)
    {
        super(group, x, y, army, key, frame);

        this.maxHealth = 300;
        this.heal(this.maxHealth);
        this.vehicleCosts = new VehicleCosts();

        this.anchor.setTo(.5,.5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setCircle(28, -6, 6);
        this.inputEnabled = true;

        this.animations.add('idle', [0, 1, 2], 3, true);
        this.animations.add('build', [0, 1, 2, 3, 5, 6, 7], 5, false);
        this.animations.add('destroyed', [4], 5, true);
        this.animations.play('idle');

        group.add(this);
    }

    public update ()
    {
        super.update();
        if (this.isDestroyed()) {
            this.animations.play("destroyed");
        }
    }

    public buildMiner()
    {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Miner);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function() {
                army.recruitMiner(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }

    public buildScout()
    {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Scout);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function() {
                army.recruitScout(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }

    public buildBuilder()
    {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Builder)
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function() {
                army.recruitBuilder(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }

    public buildTank()
    {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Tank);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function() {
                army.recruitTank(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }

    public getStatus()
    {
        return this.animations.currentAnim.name;
    }

    public stock(quantity: number)
    {
        this.stockedQuantity += quantity;
    }

    public unstock(quantity: number)
    {
        this.stockedQuantity -= quantity;
    }

    public getStock(): number
    {
        return this.stockedQuantity;
    }

    private getBuildVehicleX(): number
    {
        return this.getPosition().x + 30;
    }

    private getBuildVehicleY(): number
    {
        return this.getPosition().y + 10;
    }

    private getBuildTime(): number
    {
        return Phaser.Timer.SECOND * 1.8
    }
}
