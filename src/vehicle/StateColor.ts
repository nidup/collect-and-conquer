

export class StateColors
{
    private stateColors: {} = {
        'wander': '#93d9f4',
        'path following': '#00cd00',
        'patrolling': '#eedb13',
        'pursuing': '#ee8400',
        'evading': '#ff4040'
    };

    public getColor(state: string): string
    {
        let color = this.stateColors[state];
        if (color == undefined) {
            color = '#FFFFFF';
        }

        return color;
    }
}