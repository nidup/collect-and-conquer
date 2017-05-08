
import {Boid} from "../Boid";
import {SeekBehavior} from "./SeekBehavior";

/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-pursuit-and-evade--gamedev-2946s
 */
export class PursuingBehavior
{
    private host: Boid;
    private seekBehavior: SeekBehavior;

    constructor (host: Boid, seekBehavior: SeekBehavior)
    {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }

    public pursuing(target :Boid)
    {
        let distance = this.host.getPosition().distance(target.getPosition());
        let updatesAhead = distance / target.getMaxVelocity().x;

        const futurePosition = target.getPosition().clone();
        futurePosition.add(
            target.getVelocity().x * updatesAhead,
            target.getVelocity().y * updatesAhead
        );

        return this.seekBehavior.seek(futurePosition);
    }
}