
export class JukeBox
{
    private musicOn: boolean;
    private soundOn: boolean;
    private music: Phaser.Sound;
    private explosion: Phaser.Sound;
    private blaster: Phaser.Sound;

    public constructor(game: Phaser.Game)
    {
        this.music = game.add.audio('music');
        this.musicOn = true;
        this.music.play('', 0, 1, true);
        this.soundOn = true;
        this.explosion = game.add.audio('explosion');
        this.blaster = game.add.audio('blaster');
    }

    public switchMusic()
    {
        this.musicOn = !this.musicOn;
        if (this.musicOn) {
            this.music.resume();
        }  else {
            this.music.pause();
        }
    }

    public switchSound()
    {
        this.soundOn = !this.soundOn;
    }

    public playBlaster()
    {
        if (this.soundOn) {
            this.blaster.play();
        }
    }

    public playExplosion()
    {
        if (this.soundOn) {
            this.explosion.play('', 0, 0.3);
        }
    }
}