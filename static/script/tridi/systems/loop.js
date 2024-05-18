import { Clock } from "https://threejs.org/build/three.module.js";

const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer, controls, results) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.controls = controls;
    this.results = results;
    this.updatables = [];
    this.updatables.push(this.controls);
    this.running = false;
  }

  start() {
    this.running = true;
    this.results.reload();
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.running = false;
    this.controls.setStateIdle();
    this.renderer.setAnimationLoop(null);
    this.results.meshObject.setInitialPos();
    this.results.drawGraph();
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();
    if (this.controls.timer.timeout()) {
      this.stop();
      return;
    }

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}


class Timer {
  constructor(timeLimit) {
    this.timeLimit = timeLimit;
    this.startTimeStamp = undefined;
    this.running = false;
  }

  now() {
    return Math.round(Date.now() / 1000);
  }

  secondsRemaining() {
    if (this.running) {
        return this.timeLimit - (this.now() - this.startTimeStamp);
    } else {
        return this.timeLimit;
    }

  }

  start() {
    this.startTimeStamp = this.now();
    this.running = true;
  }

  setTimeLimit(nSeconds) {
    this.timeLimit = nSeconds;
  }

  stop() {
    this.running = false;
    this.startTimeStamp = undefined;
  }

  reload() {
    stop();
  }

  timeout() {
    return this.now() >= (this.startTimeStamp + this.timeLimit);
  }

}

export { Loop, Timer };
