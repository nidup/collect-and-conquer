
import {Map} from "../../../ai/map/Map";

export class SharedMemory
{
    private knownTiles: Array<Array<boolean>>;
    private tileSize: number;

    public constructor(map: Map)
    {
        this.knownTiles = map.getGrounds().reduce(
            function(rows: Array<Array<boolean>>, row: Array<number>) {
                rows.push(
                    row.reduce(
                        function(row: Array<boolean>, ground: number) {
                            row.push(false);
                            return row;
                        },
                        []
                    )
                );
                return rows;
            },
            []
        );
        this.tileSize = map.getTileSize();
    }

    public registerEnvironment(position: Phaser.Point, visibilityScope: number)
    {
        // TODO: draw a circle!

        const scope = Math.ceil(visibilityScope / this.tileSize) + 1;
        const centerX = Math.ceil((position.x) / this.tileSize) - 1;
        const centerY = Math.ceil((position.y) / this.tileSize) - 1;
        const startX = Math.ceil(centerX - scope / 2);
        const endX = Math.ceil(centerX + scope / 2);
        const startY = Math.ceil(centerY - scope / 2);
        const endY = Math.ceil(centerY + scope / 2);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (x > 0 && y > 0 && y < this.knownTiles.length && x < this.knownTiles[y].length) {
                    this.knownTiles[y][x] = true;
                }
            }
        }
    }

    public getKnownTiles(): Array<Array<boolean>>
    {
        return this.knownTiles;
    }
}
