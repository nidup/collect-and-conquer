
export class HealthBarDrawer
{
    public draw(host: Phaser.Sprite, bitmap: Phaser.BitmapData, totalWidth: number)
    {
        const healthRatio = host.health / host.maxHealth;
        const healthWidth = totalWidth * healthRatio;
        const background = {red: 0, green: 0, blue: 0};
        const good = {red: 0, green: 255, blue: 0};
        const medium = {red: 255, green: 100, blue: 0};
        const bad = {red: 255, green: 0, blue: 0};

        for (let indX = 0; indX < totalWidth; indX++) {
            if (indX <= healthWidth) {
                if (healthRatio > 0.6) {
                    this.drawColumn(bitmap, indX, good);
                } else if (healthRatio > 0.3) {
                    this.drawColumn(bitmap, indX, medium);
                } else {
                    this.drawColumn(bitmap, indX, bad);
                }
            } else {
                this.drawColumn(bitmap, indX, background);
            }
        }
    }

    private drawColumn(bitmap: Phaser.BitmapData, indX: number, color: {red: number, green: number, blue: number})
    {
        const height = bitmap.height;
        for (let y = 0; y < height; y++) {
            bitmap.setPixel(indX, y, color.red, color.green, color.blue);
        }
    }
}