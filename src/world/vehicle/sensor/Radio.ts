
import {Camera} from "./Camera";
import {Radar} from "./Radar";

export class Radio
{
    private camera: Camera;
    private radar: Radar;

    public constructor(camera: Camera, radar: Radar)
    {
        this.camera = camera;
        this.radar = radar;
    }

    public communicate(position: Phaser.Point)
    {
        this.radar.registerVisibleEnvironment(position, this.camera.getVisibilityScope());
    }
}
