/// <reference path="../lib/phaser.d.ts"/>

import Boot from "./game/state/Boot";
import Preload from "./game/state/Preload";
import Menu from "./game/state/Menu";
import Play from "./game/state/Play";

class SimpleGame extends Phaser.Game {

    constructor()
    {
        super(
            1280,
            800,
            Phaser.CANVAS,
            "content",
            null
        );

        this.antialias = false;

        this.state.add('Boot', Boot);
        this.state.add('Preload', Preload);
        this.state.add('Menu', Menu);
        this.state.add('Play', Play);
        this.state.start('Boot');
    }
}

window.onload = () => {
    new SimpleGame();
};
