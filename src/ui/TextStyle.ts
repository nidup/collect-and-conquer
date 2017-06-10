
export class TextStyle
{
    public getColorStyle(color)
    {
        const styleNormal = { font: "14px Share Tech Mono", fill: color, boundsAlignH: "center", boundsAlignV: "top" };

        return styleNormal;
    }

    public getNormalStyle()
    {
        const colorNormal = '#8cd6ff';
        const styleNormal = { font: "16px Share Tech Mono", fill: colorNormal, align: "center" };

        return styleNormal;
    }

    public getOverStyle()
    {
        const colorOver = '#5a7086';
        const styleOver = { font: "16px Share Tech Mono", fill: colorOver, align: "center" };

        return styleOver;
    }
}
