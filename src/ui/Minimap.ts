
import {Map} from "../ai/map/Map";

/**
 * @see https://phaser.io/examples/v2/create/generate-sprite
 */
export class Minimap
{
    public constructor(game: Phaser.Game, panelWidth: number, map: Map)
    {
        const minimapData = map.getGrounds().reduce(
            function (mapData: Array<string>, groundRow: Array<number>) {
                mapData.push(
                    groundRow.reduce(
                        function (mapRow: string, ground: number) {
                            mapRow += ground.toString();
                            return mapRow;
                        },
                        ''
                    )
                );
                return mapData;
            },
            []
        );

        game.create.texture('minimap', minimapData, 4, 4, 0);
        const marginX = 15;
        const marginY = 15;

        game.add.sprite(game.width - panelWidth + marginX, marginY, 'minimap');
    }
}