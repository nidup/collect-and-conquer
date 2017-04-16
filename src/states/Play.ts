
import {Hero} from "../Hero";
import {Snake} from "../Snake";
import {Gnome} from "../Gnome";
import LevelProgress from "../LevelProgress";

export default class Play extends Phaser.State {

    private hero: Hero;
    private snakes: Array<Snake>;
    private gnomes: Array<Gnome>;
    private levelProgress: LevelProgress;
    private map;
    private layer;
    private background;
    private debug: boolean = false;
    private seaLevel: number = 450;
    private briefingText : Phaser.BitmapText;
    private coinLeftEmitter;
    private coinRightEmitter;

    public create()
    {
        if (this.debug) {
            this.game.time.advancedTiming = true
        }
        this.game.stage.backgroundColor = '#000000';

        this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background-night');
        this.background = this.game.add.tileSprite(0, 0, 800, 600, 'background-day');
        this.background.loadTexture('background-night');
        this.background.fixedToCamera = true;

        this.briefingText = this.game.add.bitmapText(40, 40, 'carrier-command','Night has come, Let\'s collect underpants!', 10);
        this.briefingText.fixedToCamera = true;

        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles-1');
        this.map.setCollision(
            [
                1, 2, 3, 4, 5, 6, 7,
                12, 13,
                21, 22, 23, 24, 25, 26, 27,
                32, 33
            ]
        );

        this.layer = this.map.createLayer('Tile Layer 1');
        if (this.debug) {
            this.layer.debug = true;
        }
        this.layer.resizeWorld();

        this.game.physics.arcade.gravity.y = 350;

        this.hero = new Hero(this.game, 50, 370, 'king', 0, this.game.input.keyboard);
        this.game.camera.follow(this.hero);

        this.snakes = new Array();
        this.snakes[0] = new Snake(this.game, 330, 370, 'snake', 0);
        this.snakes[1] = new Snake(this.game, 750, 250, 'snake', 0);
        this.snakes[2] = new Snake(this.game, 1050, 250, 'snake', 0);

        this.gnomes = new Array();
        this.gnomes[0] = new Gnome(this.game, 210, 200, 'gnome', 0);
        this.gnomes[1] = new Gnome(this.game, 530, 370, 'gnome', 0);
        this.gnomes[2] = new Gnome(this.game, 1550, 370, 'gnome', 0);
        this.gnomes[3] = new Gnome(this.game, 1750, 370, 'gnome', 0);

        this.levelProgress = new LevelProgress(this.gnomes, this.hero);

        this.coinLeftEmitter = this.game.add.emitter(0, 80, 1000);
        this.coinLeftEmitter.bounce.setTo(0.5, 0.5);
        this.coinLeftEmitter.setXSpeed(100, 500);
        this.coinLeftEmitter.setYSpeed(-50, 50);
        this.coinLeftEmitter.makeParticles('coin', [0, 1, 2, 3, 4, 5, 6, 7]);

        this.coinRightEmitter = this.game.add.emitter(800, 80, 1000);
        this.coinRightEmitter.bounce.setTo(0.5, 0.5);
        this.coinRightEmitter.setXSpeed(-100, -500);
        this.coinRightEmitter.setYSpeed(-50, 50);
        this.coinRightEmitter.makeParticles('coin', [0, 1, 2, 3, 4, 5, 6, 7]);
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
            this.coinLeftEmitter.start(false, 5000, 20);
            this.coinRightEmitter.start(false, 5000, 20);
            this.hero.dance();
            for (let i = 0; i < this.gnomes.length; i++) {
                this.gnomes[i].dance();
            }
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
            this.background.loadTexture('background-day');
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
            for (let i = 0; i < this.snakes.length; i++) {
                this.game.debug.body(this.snakes[i]);
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
