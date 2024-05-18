import { createCamera} from "./components/camera.js";
import { createPlaneGeometry, createAxesHelper, PizzaSlice } from "./components/cube.js";
import { createScene} from "./components/scene.js";

import { Controls, Results } from "./systems/controls.js";
import { createRenderer} from "./systems/renderer.js";
import { Loop, Timer } from "./systems/loop.js";
import { Resizer } from "./systems/resizer.js";

let camera;
let renderer;
let scene;
let loop;


class Tridi {
    constructor(container) {
        // SCENE ELEMENTS
        this.camera = createCamera();
        this.scene = createScene();
        this.renderer = createRenderer();
        this.controls = new Controls(new Timer(60));

        container.append(this.renderer.domElement);

        // PLANE
        this.plane = createPlaneGeometry();
        this.scene.add(this.plane);

        // PIZZA SLICE
        this.pizza = new PizzaSlice();
        this.scene.add(this.pizza);

        // AXES HELPER
        const axesHelper = createAxesHelper();
        this.scene.add(axesHelper);

        // FLAGS
        this.running = false;

        this.results = new Results(this.pizza);
        this.loop = new Loop(this.camera, this.scene, this.renderer, this.controls, this.results);
        this.loop.updatables.push(this.pizza);
        this.loop.updatables.push(this.results);

        const resizer = new Resizer(container, this.camera, this.renderer);

        //this.loop.finalizers.push(this.render);
        //this.loop.finalizers.push(this.pizza.setInitialPos);
        // this.loop.finalizer = this.stop;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.running = true;
        this.results.reload();
        this.controls.setStateRunning();
        this.loop.start();
    }

    stop() {
        this.loop.stop();
        this.pizza.setInitialPos();
        this.render();
        this.running = false;
        this.controls.setStateIdle();
        this.results.drawGraph();
        console.log("RESULTS:");
        console.log(this.results.xvals);
    }
}

export { Tridi };
