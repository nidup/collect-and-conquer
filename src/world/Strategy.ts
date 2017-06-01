
export class Strategy
{
    private attacking: boolean = false;

    public attack()
    {
        this.attacking = true;
    }

    public defend()
    {
        this.attacking = false;
    }

    public isAttacking(): boolean
    {
        return this.attacking;
    }

    public isDefending(): boolean
    {
        return !this.attacking;
    }
}
