
export interface Boid
{
    getVelocity() : Phaser.Point;
    getMaxVelocity() : Phaser.Point;
    getPosition() : Phaser.Point;
    getMass() : number;
}