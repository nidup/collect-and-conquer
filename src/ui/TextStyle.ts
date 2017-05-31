
export class TextStyle
{
    public getNormalStyle()
    {
        const colorNormal = '#8cd6ff';
        const styleNormal = { font: "14px Arial", fill: colorNormal, align: "center" };

        return styleNormal;
    }

    public getOverStyle()
    {
        const colorOver = '#5a7086';
        const styleOver =  { font: "14px Arial", fill: colorOver, align: "center" };

        return styleOver;
    }
}