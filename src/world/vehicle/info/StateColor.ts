
export class StateColors
{
    private stateColors: {} = {
        'explore': '#93d9f4',
        'go to mine': '#00cd00',
        'go to oil': '#00cd00',
        'patrolling': '#eedb13',
        'escorting': '#eedb13',
        'protect mine': '#eedb13',
        'pursuing': '#ee8400',
        'evading': '#ff4040',
        'attack': '#ff4040'
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