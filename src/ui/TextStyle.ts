
export class TextStyle
{
    public getColorStyle(color)
    {
        const styleNormal = { font: "14px Share Tech Mono", fill: color, boundsAlignH: "center", boundsAlignV: "top" };

        return styleNormal;
    }

    public getNormalStyle(size: number = 16)
    {
        const colorNormal = '#8cd6ff';
        const styleNormal = { font: size+"px Share Tech Mono", fill: colorNormal };

        return styleNormal;
    }

    public getOverStyle()
    {
        const colorOver = '#5a7086';
        const styleOver = { font: "16px Share Tech Mono", fill: colorOver };

        return styleOver;
    }
}
