
export default class Preload extends Phaser.State {

    public preload ()
    {
        this.loadTilemap();
        this.loadTileImages();
        this.loadGameImages();

        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

        this.load.image('CommandsPanel', 'assets/interface/CommandPanel.png');
        this.load.image('UnitBackground', 'assets/interface/UnitSelectionBackground.png');
    }

    public create ()
    {
        this.game.state.start('Play'); // TODO: shortcuting "Menu" state :)
    }

    private loadTilemap()
    {
        this.load.tilemap('level1', 'assets/tilemap/level1.json', null, Phaser.Tilemap.TILED_JSON);
    }

    private loadTileImages()
    {

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
        this.load.image('MntMisc', 'assets/terrain/MntMisc.png');
    }

    private loadGameImages()
    {
        this.load.spritesheet('Builder1', 'assets/vehicle/Builder1.png', 20, 20);
        this.load.spritesheet('Scout1', 'assets/vehicle/Scout1.png', 20, 20);
        this.load.spritesheet('Tank5', 'assets/vehicle/Tank5.png', 20, 20);
        this.load.spritesheet('Miner', 'assets/vehicle/Miner.png', 20, 20);

        this.load.spritesheet('Base', 'assets/building/Base.png', 60, 60);
        this.load.spritesheet('Mine', 'assets/building/Mine.png', 40, 60);
        this.load.spritesheet('Generator', 'assets/building/Generator.png', 40, 60);

        this.load.spritesheet('Icons', 'assets/misc/Icons.png', 20, 20);
        this.load.spritesheet('Markers', 'assets/misc/Markers.png', 10, 10);
    }
}
