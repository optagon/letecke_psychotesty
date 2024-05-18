import { PerspectiveCamera, Vector3 } from "https://threejs.org/build/three.module.js";

function createCamera() {
  const camera = new PerspectiveCamera(
    45, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    100, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(2, 3, 3);
  camera.lookAt(new Vector3(0, 0, 0));
  return camera;
}

export { createCamera };
