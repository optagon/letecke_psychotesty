import { CircleGeometry, PlaneGeometry,
  Mesh, MeshBasicMaterial, AxesHelper, Vector3 } from "https://threejs.org/build/three.module.js";


class Results {
    constructor() {

    }

}


class PizzaSlice extends Mesh {
  constructor() {
    const thetaStart = Math.PI * (3/8);
    const thetaLength = Math.PI / 4;
    const geometry = new CircleGeometry(1, 32, thetaStart, thetaLength);
    const material = new MeshBasicMaterial({ color: 'purple' });
    super(geometry, material)
    this.rotZ = 0;
    this.pos = new Vector3();
    this._showPos = false;
  }

  tick() {

    // UP AND DOWN
    if (Math.random() > 0.95) {     //
      if (Math.random() > 0.5) {
        this.moveUp();
      } else {
        this.moveDown();
      }
    } else {
      if (this.worldPos('z') <= 0) {
          if (Math.random() <= (-this.worldPos('z') * 1 / 30)) {
              this.moveUp();
          }
      } else {
          if (Math.random() <= (this.worldPos('z') * 1 / 30)) {
              this.moveDown();
          }
      }
    }

    // LEFT AND RIGHT
    if (Math.random() > 0.95) {     //
      if (Math.random() > 0.5) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else {
      if (this.worldPos('x') <= 0) {
          if (Math.random() <= (-this.worldPos('x') * 1 / 30)) {
              this.moveLeft();
          }
      } else {
          if (Math.random() <= (this.worldPos('x') * 1 / 30)) {
              this.moveRight();
          }
      }
    }


    // TILTING
    if (Math.random() > 0.95) {

      if (Math.random() > 0.5) {
        this.tiltLeft();
      } else {
        this.tiltRight();
      }

    } else {

      if (this.rotZ >= 0) {
        if (Math.random() <= (this.rotZ * 1 / 8)) {
          this.tiltLeft();
        }
      } else {
        if (Math.random() <= (-this.rotZ * 1 / 8)) {
          this.tiltRight();
        }
      }
    }

  }

  setInitialPos() {
    if (this.pos.z.toFixed(2) <= -1.5) {
        return;
    }
    this.rotateZ(-this.rotZ);
    this.rotZ = 0;
    this.translateZ(-this.worldPos('z'));
    this.translateX(-this.worldPos('x'));
  }

  worldPos(axis) {
    if (axis=='x'){
      return this.pos.x.toFixed(2);
    }
    if (axis=='y'){
      return this.pos.y.toFixed(2);
    }
    if (axis=='z'){
      return this.pos.z.toFixed(2);
    }
  }

  printPos() {
    if (this._showPos) {
        this.getWorldPosition(this.pos.valueOf());
        console.log("PIZZA POS: " + this.pos.x.toFixed(2) + "," + this.pos.y.toFixed(2) + "," + this.pos.z.toFixed(2));
    }
  }

  tiltLeft() {
    if (this.rotZ >= (Math.PI / 3)) {
        return;
    }
    this.rotZ += 0.1;
    this.rotateZ(0.1);
    this.printPos();
  }

  tiltRight() {
      if (this.rotZ <= -(Math.PI / 3)) {
          return;
      }
      this.rotZ -= 0.1;
      this.rotateZ(-0.1);
      this.printPos();
  }

  moveUp() {
      this.getWorldPosition(this.pos.valueOf());
      if (this.pos.z.toFixed(2) <= -1.5) {
        return;
      }
      this.translateZ(-0.1);
      this.printPos();
  }

  moveDown() {
      this.getWorldPosition(this.pos.valueOf());
      if (this.pos.z.toFixed(2) >= 1.5) {
        return;
      }
      this.translateZ(0.1);
      this.printPos();
  }

  moveLeft() {
      this.getWorldPosition(this.pos.valueOf());
      if (this.pos.x.toFixed(2) <= -1.5) {
        return;
      }
      this.rotateZ(-this.rotZ);
      this.translateX(-0.1);
      this.updateMatrix();
      this.rotateZ(this.rotZ);

      this.printPos();
  }

  moveRight() {
      this.getWorldPosition(this.pos.valueOf());
      if (this.pos.x.toFixed(2) >= 1.5) {
        return;
      }
      this.rotateZ(-this.rotZ);
      this.translateX(0.1);
      this.updateMatrix();
      this.rotateZ(this.rotZ);

      this.updateMatrixWorld();
      this.printPos();
  }
}


function createPlaneGeometry() {
  const geometry = new PlaneGeometry(3, 3, 10, 10);
  const material = new MeshBasicMaterial();
  material.wireframe = true;
  const plane = new Mesh(geometry, material);
  plane.rotation.set(Math.PI/2, 0, 0);
  return plane;
}

function createAxesHelper() {
  const axesHelper = new AxesHelper( 5 );
  return axesHelper;
}

export { createPlaneGeometry, createAxesHelper, PizzaSlice};
