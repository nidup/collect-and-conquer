
import {Boid} from "../Boid";
import {SeekBehavior} from "./SeekBehavior";

export class PursuingBehavior
{
    private host: Boid;
    private seekBehavior: SeekBehavior;

    constructor (host: Boid, seekBehavior: SeekBehavior)
    {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }

    public doPursuing(target :Boid)
    {
        let distance = this.host.getPosition().distance(target.getPosition());
        let speed = distance / target.getMaxVelocity().x;

        const futurePosition = target.getPosition().clone();
        futurePosition.add(
            target.getVelocity().x * speed,
            target.getVelocity().y * speed
        );

        return this.seekBehavior.doSeek(futurePosition);
    }
}