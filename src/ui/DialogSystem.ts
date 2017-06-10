
import {DefeatDialog} from "./DefeatDialog";

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
}