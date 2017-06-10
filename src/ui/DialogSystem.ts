
import {Dialog} from "./Dialog";

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
        new Dialog(this.group, "Defeat!\n\nAll your buildings\nhave been destroyed");
    }

    public displayVictoryDialog()
    {
        this.group.game.paused = true;
        new Dialog(this.group, "Victory!\n\nYou destroyed all your\nenemy's buildings!");
    }
}
