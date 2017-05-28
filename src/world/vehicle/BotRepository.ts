
import {Bot} from "./Bot";

export class BotRepository
{
    private bots : Bot[];

    public constructor()
    {
        this.bots = [];
    }

    public all(): Bot[]
    {
        return this.bots;
    }

    public add(bot: Bot): void
    {
        this.bots.push(bot);
    }

    public remove(bot: Bot): void
    {
        const index = this.bots.indexOf(bot);
        this.bots.splice(index, 1);
    }

    public enemiesOf(myself: Bot) :Bot[]
    {
        return this.bots.filter(function (bot: Bot) { return bot != myself; });
    }

    public first(): Bot
    {
        return this.get(0);
    }

    public length(): number
    {
        return this.bots.length;
    }

    public get(index: number) :Bot
    {
        return this.bots[index];
    }
}