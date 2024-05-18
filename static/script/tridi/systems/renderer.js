import { WebGLRenderer } from "https://threejs.org/build/three.module.js";

function createRenderer() {
  const renderer = new WebGLRenderer();

  return renderer;
}

export { createRenderer };
