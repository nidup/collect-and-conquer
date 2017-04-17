
import {Hero} from "../Hero";
import {Snake} from "../Snake";
import {Gnome} from "../Gnome";
import LevelProgress from "../LevelProgress";
import {Builder} from "../vehicle/Minion";

export default class Play extends Phaser.State {

    private hero: Hero;
    private snakes: Array<Snake>;
    private gnomes: Array<Gnome>;
    private minions: Array<Builder>;
    private levelProgress: LevelProgress;
    private map;
    private layer;
    private debug: boolean = true;
    private seaLevel: number = 450;
    private briefingText : Phaser.BitmapText;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('GrasClif', 'GrasClif', 20, 20, 0, 20);
        this.map.addTilesetImage('Grass', 'Grass', 20, 20, 0, 20);
        this.map.addTilesetImage('Grass2', 'Grass2', 20, 20, 0, 20);
        this.map.addTilesetImage('GrasRoad', 'GrasRoad', 20, 20, 0, 20);
        this.map.addTilesetImage('GrassRDst', 'GrassRDst', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2CrtB', 'Grs2CrtB', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Crtc', 'Grs2Crtc', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Crtr', 'Grs2Crtr', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', 20, 20, 0, 20);
        this.map.addTilesetImage('Grs2Watr', 'Grs2Watr', 20, 20, 0, 20);
        this.map.addTilesetImage('Grss2Lav', 'Grss2Lav', 20, 20, 0, 20);
        this.map.addTilesetImage('GrssCrtr', 'GrssCrtr', 20, 20, 0, 20);
        this.map.addTilesetImage('GrssMisc', 'GrssMisc', 20, 20, 0, 20);

        this.map.setCollision(
            [
                1, 2, 3,// 4, 5, 6, 7,
             //   12, 13,
             //  21, 22, 23, 24, 25, 26, 27,
             //   32, 33
            ]
        );

        this.layer = this.map.createLayer('Tile Layer 1');
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        this.briefingText = this.game.add.bitmapText(40, 40, 'carrier-command','Night has come, Let\'s collect underpants!', 10);
        this.briefingText.fixedToCamera = true;

        this.game.physics.arcade.gravity.y = 350;

        this.hero = new Hero(this.game, 50, 370, 'king', 0, this.game.input.keyboard);
        this.game.camera.follow(this.hero);

        this.snakes = new Array();
        /*
        this.snakes[0] = new Snake(this.game, 330, 370, 'snake', 0);
        this.snakes[1] = new Snake(this.game, 750, 250, 'snake', 0);
        this.snakes[2] = new Snake(this.game, 1050, 250, 'snake', 0);
        */

        this.gnomes = new Array();
        this.gnomes[0] = new Gnome(this.game, 210, 200, 'gnome', 0);
        this.gnomes[1] = new Gnome(this.game, 530, 370, 'gnome', 0);
        this.gnomes[2] = new Gnome(this.game, 1550, 370, 'gnome', 0);
        this.gnomes[3] = new Gnome(this.game, 1750, 370, 'gnome', 0);

        this.minions = new Array();
        this.minions[0] = new Builder(this.game, 330, 370, 'Builder1', 0);

        this.levelProgress = new LevelProgress(this.gnomes, this.hero);
    }

    public update()
    {
        this.game.physics.arcade.collide(this.hero, this.layer);
        this.hero.update();

        if (this.hero.y > this.seaLevel) {
            this.briefingText.text = 'Argh! I\'m drowing!!';
            this.hero.drown();
        }

        if (this.levelProgress.isFinished()) {
            this.briefingText.text = 'Yeahhhh!! Profit!!!! You finished the game :D';
            this.hero.dance();
            for (let i = 0; i < this.gnomes.length; i++) {
                this.gnomes[i].dance();
            }
        }

        for (let i = 0; i < this.minions.length; i++) {
            //this.game.physics.arcade.collide(this.minions[i], this.layer);
            this.minions[i].update();
            //this.game.physics.arcade.overlap(this.hero, this.minions[i], this.bite, null, this);
        }

        for (let i = 0; i < this.snakes.length; i++) {
            this.game.physics.arcade.collide(this.snakes[i], this.layer);
            this.snakes[i].update();
            this.game.physics.arcade.overlap(this.hero, this.snakes[i], this.bite, null, this);
        }

        for (let i = 0; i < this.gnomes.length; i++) {
            this.game.physics.arcade.collide(this.gnomes[i], this.layer);
            this.gnomes[i].update();
            this.game.physics.arcade.overlap(this.hero, this.gnomes[i], this.steal, null, this);
        }
    }

    public bite (hero: Hero, snake: Snake)
    {
        hero.biten();
        this.briefingText.text = 'Argh! Bitten by a snake!';
    }

    public steal (hero: Hero, gnome: Gnome)
    {
        if (gnome.isNude()) {
            return;
        }
        gnome.stolen();
        if (this.levelProgress.isDay()) {
            this.hero.changeOriginPosition();
            this.briefingText.text = 'I have all of them and day is coming, let\'s go back home!';
        } else {
            this.briefingText.text = 'Niak, niak, niak, and '+this.levelProgress.countNudes()+' collected!';
        }
    }

    public render()
    {
        if (this.debug) {
            this.game.debug.body(this.hero);
            for (let i = 0; i < this.minions.length; i++) {
                this.game.debug.body(this.minions[i]);
            }

            this.game.debug.text(
                "FPS: "  + this.game.time.fps + " ",
                2,
                14,
                "#00ff00"
            );
        }
    }
}
