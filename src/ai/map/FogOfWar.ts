
export class FogOfWar
{
    public apply(bitmap: Phaser.BitmapData, knownGrounds: Array<Array<boolean>>)
    {
        for (let y = 0; y < knownGrounds.length; y++) {
            for (let x = 0; x < knownGrounds[y].length; x++) {
                const unknownGround = !knownGrounds[y][x];
                let red = 0;
                let green = 0;
                let blue = 0;
                if (unknownGround) {
                    bitmap.setPixel32(x, y, red, green, blue, 255);
                } else {
                    bitmap.setPixel32(x, y, red, green, blue, 0);
                }
            }
        }
    }
}
