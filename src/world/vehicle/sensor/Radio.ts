
import {Camera} from "./Camera";
import {Radar} from "./Radar";
import {SharedMemory} from "../knowledge/SharedMemory";

export class Radio
{
    private camera: Camera;
    private radar: Radar;
    private sharedMemory: SharedMemory;

    public constructor(camera: Camera, radar: Radar, sharedMemory: SharedMemory)
    {
        this.camera = camera;
        this.radar = radar;
        this.sharedMemory = sharedMemory;
    }

    public communicate(position: Phaser.Point)
    {
        this.sharedMemory.registerGrounds(position, this.camera.getVisibilityScope());
        const visibleOil = this.camera.closestVisibleOil(position);
        if (visibleOil) {
            this.sharedMemory.registerOil(visibleOil);
        }

    }
}
