export abstract class MapGenerator {
    protected screenWidth: number;
    protected screenHeight: number;
    protected game: Phaser.Game;
    protected map: Phaser.Tilemap;

    constructor(game: Phaser.Game, screenWidth: number, screenHeight: number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.game = game;
    }

    abstract generate(): Phaser.Tilemap;
}
