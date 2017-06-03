
import {Map} from "../ai/map/Map";
import {Tile} from "../ai/map/generator/Tile";

/**
 * @see https://phaser.io/examples/v2/create/generate-sprite sadly a bug on first display
 * @see https://phaser.io/examples/v2/bitmapdata/reveal
 */
export class Minimap
{
    public constructor(game: Phaser.Game, panelWidth: number, map: Map)
    {
        const marginX = 10;
        const marginY = 8;
        const bitmap = game.make.bitmapData(52, 40);
        for (let y = 0; y < map.getGrounds().length; y++) {
            for (let x = 0; x < map.getGrounds()[y].length; x++) {
                const ground = map.getGrounds()[y][x];
                let red = 0;
                let green = 0;
                let blue = 0;
                if (ground == Tile.GRASS) {
                    red = 31;
                    green = 112;
                    blue = 3;
                } else if (ground == Tile.MNT) {
                    red = 160;
                    green = 112;
                    blue = 96;
                } else if (ground == Tile.LAVA) {
                    red = 96;
                    green = 0;
                    blue = 0;
                } else if (ground == Tile.SNOW) {
                    red = 191;
                    green = 207;
                    blue = 223;
                }
                bitmap.setPixel(x, y, red, green, blue);
            }
        }
        bitmap.addToWorld(game.width - panelWidth + marginX, marginY, 0, 0, 4.24, 4.24);
    }
}
