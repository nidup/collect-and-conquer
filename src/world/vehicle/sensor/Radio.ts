
import {Camera} from "./Camera";
import {Radar} from "./Radar";
import {SharedMemory} from "../knowledge/SharedMemory";
import {Oil} from "../../item/Oil";

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
        const visibleOils = this.camera.visibleOils(position);
        const sharedMemory = this.sharedMemory;
        visibleOils.map(function(visibleOil: Oil) {
            sharedMemory.registerOil(visibleOil);
        });
    }
}
