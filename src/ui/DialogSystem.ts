
import {DefeatDialog, NewGameDialog, VictoryDialog} from "./Dialog";

export class DialogSystem
{
    private group: Phaser.Group;

    public constructor(group: Phaser.Group)
    {
        this.group = group;
    }

    public displayDefeatDialog()
    {
        this.group.game.paused = true;
        new DefeatDialog(this.group);
    }

    public displayVictoryDialog()
    {
        this.group.game.paused = true;
        new VictoryDialog(this.group);
    }

    public displayNewGameDialog()
    {
        this.group.game.paused = true;
        new NewGameDialog(this.group);
    }
}
