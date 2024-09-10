import * as THREE from 'three';

class Camera {
  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 10000) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 15, 30);

    // Handle resizing
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  getCamera() {
    return this.camera;
  }
}

export { Camera };
