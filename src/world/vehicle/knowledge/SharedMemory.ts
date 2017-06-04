
import {Map} from "../../../ai/map/Map";
import {Oil} from "../../item/Oil";

export class SharedMemory
{
    private knownTiles: Array<Array<boolean>>;
    private tileSize: number;
    private knownOils: Array<Oil>;

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
        this.knownOils = [];
    }

    public registerGrounds(position: Phaser.Point, visibilityScope: number)
    {
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

    public registerOil(oil: Oil)
    {
        let known = false;
        this.knownOils.forEach(function(knownOil: Oil) {
            if (knownOil == oil) {
                known = true;
            }
        });
        if (!known) {
            this.knownOils.push(oil);
        }
    }

    public getKnownOils(): Array<Oil>
    {
        this.knownOils = this.knownOils.reduce(
            function (stillExistingOils: Array<Oil>, oil: Oil) {
                if (oil.body != null) {
                    stillExistingOils.push(oil);
                }
                return stillExistingOils;
            },
            []
        );

        return this.knownOils;
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
