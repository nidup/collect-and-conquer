// Constants to describe the type of ground on the tiles
export const GRASS = 1;
export const MNT = 2;
export const LAVA = 3;
export const SNOW = 4;

export class Tile
{
    index: number;
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;

    constructor(index: number, topLeft: number, topRight: number, bottomRight: number, bottomLeft: number)
    {
        this.index = index;
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomRight = bottomRight;
        this.bottomLeft = bottomLeft;
    }

    static get GRASS() {
        return GRASS;
    }

    static get MNT() {
        return MNT;
    }

    static get LAVA() {
        return LAVA;
    }

    static get SNOW() {
        return SNOW;
    }

    static get GROUNDS() {
        return [GRASS, MNT, LAVA, SNOW];
    }
}
