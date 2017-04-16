
import {Gnome} from "./Gnome";
import {Hero} from "./Hero";

export default class LevelProgress {

    private gnomes: Array<Gnome>;
    private hero: Hero;

    constructor(gnomes: Array<Gnome>, hero: Hero) {
        this.gnomes = gnomes;
        this.hero = hero;
    }

    public isFinished() {
        return (this.isDay() && this.hero.isBackHome());
    }

    public isDay() {
        return this.countNudes() == this.gnomes.length;
    }

    public countNudes() {
        let countNude = 0;
        for (let i = 0; i < this.gnomes.length; i++) {
            if (this.gnomes[i].isNude()) {
                countNude++;
            }
        }

        return countNude;
    }
}
