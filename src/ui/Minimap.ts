
import {Map} from "../ai/map/Map";
import {Tile} from "../ai/map/generator/Tile";
import {Army} from "../world/Army";
import {Building} from "../world/building/Building";
import {Vehicle} from "../world/vehicle/Vehicle";
import {PlayerRepository} from "../game/player/PlayerRepository";
import {Player} from "../game/player/Player";
import {ItemRepository} from "../world/item/ItemRepository";
import {Item} from "../world/item/Item";

/**
 * @see https://phaser.io/examples/v2/bitmapdata/reveal
 */
export class Minimap
{
    private bitmap: Phaser.BitmapData;
    private map: Map;
    private players: PlayerRepository;
    private items: ItemRepository;

    public constructor(game: Phaser.Game, panelWidth: number, map: Map, players: PlayerRepository, items: ItemRepository)
    {
        this.map = map;
        this.players = players;
        this.items = items;
        const marginX = 10;
        const marginY = 8;
        this.bitmap = game.make.bitmapData(52, 40);
        this.bitmap.addToWorld(game.width - panelWidth + marginX, marginY, 0, 0, 4.24, 4.24);
    }

    public update()
    {
        this.drawGrounds(this.map);
        const myself = this;
        this.players.all().forEach(
            function(player: Player) {
                myself.drawBuildings(player.getArmy());
                myself.drawVehicles(player.getArmy());
            }
        )
        this.drawItems(this.items);
    }

    public drawGrounds(map: Map)
    {
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
                this.bitmap.setPixel(x, y, red, green, blue);
            }
        }
    }

    public drawBuildings(army: Army)
    {
        const myself = this;
        army.getBuildings().map(
            function (building: Building) {
                const x = Math.ceil((building.getPosition().x + 1) / 20); // TODO!!
                const y = Math.ceil((building.getPosition().y + 1) / 20);
                const color = myself.getColorRGB(army);
                myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x+1, y, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x, y+1, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x+1, y+1, color.red, color.green, color.blue);
            }
        );
    }

    public drawVehicles(army: Army)
    {
        const myself = this;
        army.getVehicles().map(
            function (vehicle: Vehicle) {
                const x = Math.ceil((vehicle.getPosition().x + 1) / 20); // TODO get tilesize!! Merge MapAnalyse / Map
                const y = Math.ceil((vehicle.getPosition().y + 1) / 20);
                const color = myself.getColorRGB(army);
                myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
            }
        );
    }

    private getColorRGB(army: Army): {red: number, green: number, blue: number}
    {
        const colorHex = army.getColor().toString(16);

        return {
            red: parseInt(colorHex.substring(0,2), 16),
            green: parseInt(colorHex.substring(2,4), 16),
            blue: parseInt(colorHex.substring(4,6),16)
        };
    }

    public drawItems(items: ItemRepository)
    {
        const myself = this;
        items.oils().map(
            function (item: Item) {
                const x = Math.ceil((item.getPosition().x + 1) / 20); // TODO!!
                const y = Math.ceil((item.getPosition().y + 1) / 20);

                '#ff8b00';

                const color = {red: 255, green: 139, blue: 0};
                myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x+1, y, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x, y+1, color.red, color.green, color.blue);
                myself.bitmap.setPixel(x+1, y+1, color.red, color.green, color.blue);
            }
        );
    }
}
