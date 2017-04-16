
export default class Preload extends Phaser.State {

    public preload ()
    {
        this.load.tilemap('level1', 'assets/tilemap/level1.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('GrasClif', 'assets/terrain/GrasClif.png');
        this.load.image('Grass', 'assets/terrain/Grass.png');
        this.load.image('Grass2', 'assets/terrain/Grass2.png');
        this.load.image('GrasRoad', 'assets/terrain/GrasRoad.png');
        this.load.image('GrassRDst', 'assets/terrain/GrassRDst.png');
        this.load.image('Grs2CrtB', 'assets/terrain/Grs2CrtB.png');
        this.load.image('Grs2Crtc', 'assets/terrain/Grs2Crtc.png');
        this.load.image('Grs2Crtr', 'assets/terrain/Grs2Crtr.png');
        this.load.image('Grs2Mnt', 'assets/terrain/Grs2Mnt.png');
        this.load.image('Grs2Watr', 'assets/terrain/Grs2Watr.png');
        this.load.image('Grss2Lav', 'assets/terrain/Grss2Lav.png');
        this.load.image('GrssCrtr', 'assets/terrain/GrssCrtr.png');
        this.load.image('GrssMisc', 'assets/terrain/GrssMisc.png');

        this.load.spritesheet('Builder1', 'assets/vehicle/Builder1.png', 20, 20);

        this.load.spritesheet('nude', 'assets/forrest/nude.png', 32, 32);
        this.load.spritesheet('king', 'assets/forrest/king.png', 32, 32);
        this.load.spritesheet('gnome', 'assets/forrest/gnome.png', 32, 32);
        this.load.spritesheet('snake', 'assets/forrest/snake.png', 32, 32);
        this.load.spritesheet('coin', 'assets/forrest/coins.png', 16, 16);
        //this.load.image('background-day', 'assets/forrest/background-day.png');
        //this.load.image('background-night', 'assets/forrest/background-night.png');
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
    }

    public create ()
    {
        this.game.state.start('Play'); // TODO: Menu!
    }
}
