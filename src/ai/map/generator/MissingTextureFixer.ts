
import {TileRegistry} from "./TilesRegistry";
import {Tile} from "./Tile";

export class MissingTextureFixer {

    static fix(grounds: Array<Array<number>>, tileRegistry: TileRegistry): Array<Array<number>> {
        let result = grounds;
        let foundMissingTexture = true;
        let remainingTries = 10;

        while (remainingTries > 0 && foundMissingTexture) {
            foundMissingTexture = false;
            let missingTexturePosition = MissingTextureFixer.getNextMissingTexturePosition(result, tileRegistry);
            if (null !== missingTexturePosition) {
                foundMissingTexture = true;
                let foundReplacement = false;
                let gap = 2;
                while (!foundReplacement && gap < 4) {
                    console.log('Missing texture at ' + missingTexturePosition.x + ',' + missingTexturePosition.y + ' - looking with gap ' + gap);
                    let current = this.createTemplate(missingTexturePosition, gap, result);

                    let availableSquares = this.getAvailableSquares(current, tileRegistry);
                    if (availableSquares.length) {
                        foundReplacement = true;
                        let availableSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
                        availableSquare.forEach(function (lines, y) {
                            lines.forEach(function (cell, x) {
                                result[y][x] = cell;
                            });
                        });
                    }

                    gap++;
                }
            }
            remainingTries--;
        }

        return result;
    }

    static getNextMissingTexturePosition(grounds: Array<Array<number>>, tileRegistry: TileRegistry): Phaser.Point|null {
        let result = null;

        grounds.slice(0, -1).forEach(function (line, y) {
            line.slice(0, -1).forEach(function (cell, x) {
                if (null === result) {
                    let tile = tileRegistry.find({
                        topLeft: grounds[y][x],
                        topRight: grounds[y][x + 1],
                        bottomRight: grounds[y + 1][x + 1],
                        bottomLeft: grounds[y + 1][x]
                    });

                    if (null === tile) {
                        result = new Phaser.Point(x, y);
                    }
                }
            });
        });

        return result;
    }

    static getAvailableSquares(current: Array<Array<number>>, tileRegistry: TileRegistry): Array<Array<Array<number>>> {
        let results = [];

        let nextX = null;
        let nextY = null;

        current.forEach(function (lines, y) {
            lines.forEach(function (cell, x) {
                if (null === nextX && null === nextY && null === current[y][x]) {
                    nextX = x;
                    nextY = y;
                }
            })
        });

        if (null === nextX && null === nextY) {
            return [current];
        }

        for (let i = 0; i< this.availableGrounds.length;i++) {
            let temp = MissingTextureFixer.cloneArray(current);
            temp[nextY][nextX] = this.availableGrounds[i];
            if (MissingTextureFixer.isValidTemp(temp, tileRegistry)) {
                results = results.concat(this.getAvailableSquares(temp, tileRegistry));
                if (results.length && this.isFull(results[0])) {
                    return [results[0]];
                }
            }
        }

        return results;
    }

    static isFull(matrix: Array<Array<number>>): boolean {
        let result = true;
        matrix.forEach(function (lines) {
            lines.forEach(function (cell) {
                result = result && (cell !== null);
            })
        });

        return result;
    }

    static cloneArray(matrix: Array<Array<number>>): Array<Array<number>> {
        let result = [];
        matrix.forEach(function (lines, y) {
            result[y] = [];
            lines.forEach(function (cell, x) {
                result[y][x] = cell;
            })
        });

        return result;
    }

    static get availableGrounds(): Array<number> {
        return [Tile.LAVA, Tile.GRASS, Tile.MNT, Tile.SNOW, 2];
    }

    private static isValidTemp(temp: Array<Array<number>>, tileRegistry: TileRegistry): boolean {
        let valid = true;
        temp.slice(0, -1).forEach(function (lines, y) {
            lines.slice(0, -1).forEach(function (cell, x) {
                if (null !== temp[y][x] &&
                    null !== temp[y][x + 1] &&
                    null !== temp[y + 1][x + 1] &&
                    null !== temp[y + 1][x]) {
                    let tile = tileRegistry.find({
                        topLeft: temp[y][x],
                        topRight: temp[y][x + 1],
                        bottomRight: temp[y + 1][x + 1],
                        bottomLeft: temp[y + 1][x]
                    });

                    valid = valid && (tile !== null);
                }
            });
        });

        return valid;
    }

    private static createTemplate(
        missingTexturePosition: Phaser.Point,
        gap: number,
        result: Array<Array<number>>
    ): Array<Array<number>> {
        let current = [];
        let topY = Math.max(0, missingTexturePosition.y - gap);
        let bottomY = Math.min(result.length, missingTexturePosition.y + gap);
        let leftX = Math.max(0, missingTexturePosition.x - gap);
        let rightX = Math.min(result[0].length, missingTexturePosition.x + gap);

        for (let y = topY; y <= bottomY; y++) {
            current[y] = [];
            for (let x = leftX; x <= rightX; x++) {
                if (y === topY || y === bottomY || x === leftX || x === rightX) {
                    current[y][x] = result[y][x];
                } else {
                    current[y][x] = null;
                }
            }
        }

        return current;
    }
}
