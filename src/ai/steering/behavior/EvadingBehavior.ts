
import {Boid} from "../Boid";
import {FleeBehavior} from "./FleeBehavior";

/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-pursuit-and-evade--gamedev-2946
 */
export class EvadingBehavior
{
    private host: Boid;
    private fleeBehavior: FleeBehavior;

    constructor (host: Boid, fleeBehavior: FleeBehavior)
    {
        this.host = host;
        this.fleeBehavior = fleeBehavior;
    }

    public evading(target :Boid)
    {
        let distance = this.host.getPosition().distance(target.getPosition());
        let updatesAhead = distance / target.getMaxVelocity().x;

        const futurePosition = target.getPosition().clone();
        futurePosition.add(
            target.getVelocity().x * updatesAhead,
            target.getVelocity().y * updatesAhead
        );

        return this.fleeBehavior.flee(futurePosition);
    }
}