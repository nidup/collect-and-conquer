

export interface SteerableEntity
{
    getVelocity() : Phaser.Point;// Vector?
    getMaxVelocity() : Phaser.Point;
    getPosition() : Phaser.Point;
    getMass() : number;
}