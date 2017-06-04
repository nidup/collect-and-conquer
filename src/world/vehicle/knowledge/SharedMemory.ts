
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

        const centerX = Math.ceil((position.x) / this.tileSize) - 1;
        const centerY = Math.ceil((position.y) / this.tileSize) - 1;
        const radius = Math.ceil(Math.ceil(visibilityScope / this.tileSize) / 2);

        const points = this.getCirclePoints(centerX, centerY, radius);
        const knownTiles = this.knownTiles;
        points.map(function(point: {x: number, y:number}) {
            if (point.x >= 0 && point.y >= 0 && point.y < knownTiles.length && point.x < knownTiles[point.y].length) {
                knownTiles[point.y][point.x] = true;
            }
        });
    }

    public getKnownTiles(): Array<Array<boolean>>
    {
        return this.knownTiles;
    }

    private getCirclePoints(centerX: number, centerY: number, radius: number): Array<{x: number, y:number}>
    {
        const points = [];
        for (let i = -radius; i<=radius; i+=1) {
            for (let j = -radius; j<=radius; j+=1) {
                if (Math.round(Math.sqrt(i*i + j*j)) <= radius) {
                    points.push({x: i + centerX, y: j + centerY});
                }
            }
        }

        return points;
    }
}
