import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Spaceship {
  constructor(scene, spaceshipPath) {
    this.scene = scene;
    this.spaceshipPath = spaceshipPath;
    this.spaceship = null;  // Will hold the loaded spaceship model
    this.speed = 20;  // Base movement speed
    this.smoothness = 0.1;  // LERP factor for smooth movement
    this.velocity = new THREE.Vector3(0, 0, 0);  // Velocity for inertia
    this.acceleration = 1.5;  // Controls how fast the spaceship reaches full speed
    this.drag = 0.95;  // Factor to gradually reduce the velocity (inertia)
  }

  // Method to load the spaceship using GLTFLoader
  load() {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        this.spaceshipPath,
        (gltf) => {
          this.spaceship = gltf.scene;
          this.spaceship.scale.set(0.1, 0.1, 0.1);
          this.spaceship.position.set(0, 0, 0);  // Set initial position of spaceship
          this.scene.add(this.spaceship);  // Add spaceship to the scene

          // Apply custom material properties
          this.spaceship.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.metalness = 1;
              child.material.roughness = 0.3;
              child.material.emissive = new THREE.Color(0x222222);
              child.material.emissiveIntensity = 1.5;
              child.material.needsUpdate = true;
            }
          });

          resolve(this.spaceship);  // Resolve when the spaceship is loaded
        },
        undefined,
        (error) => {
          console.error('Error loading spaceship:', error);
          reject(error);
        }
      );
    });
  }

  // Smooth movement and tilt logic for the spaceship
  move(left, right, up, down) {
    if (this.spaceship) {
      const tiltFactor = 0.05;  // Adjust this factor for smoother/faster tilt transitions
      const maxTiltZ = 0.8;  // Maximum tilt for left/right
      const maxTiltX = 0.5;  // Maximum tilt for up/down

      // Apply acceleration based on input
      if (left) this.velocity.x += this.acceleration;
      if (right) this.velocity.x -= this.acceleration;
      if (up) this.velocity.y += this.acceleration;
      if (down) this.velocity.y -= this.acceleration;

      // Apply velocity (with drag) to position
      this.velocity.multiplyScalar(this.drag);  // Gradually reduce velocity for smoother stop
      this.spaceship.position.add(this.velocity);  // Update position based on velocity

      // Clamp movement within boundaries (adjust limits as needed)
      this.spaceship.position.x = THREE.MathUtils.clamp(this.spaceship.position.x, -2500, 2500);
      this.spaceship.position.y = THREE.MathUtils.clamp(this.spaceship.position.y, -2500, 2500);

      // Calculate target tilt angles based on movement
      const targetTiltZ = left ? -maxTiltZ : right ? +maxTiltZ : 0;
      const targetTiltX = up ? -maxTiltX : down ? +maxTiltX : 0;

      // Smoothly interpolate the current tilt to the target tilt using lerp
      this.spaceship.rotation.z = THREE.MathUtils.lerp(this.spaceship.rotation.z, targetTiltZ, tiltFactor);
      this.spaceship.rotation.x = THREE.MathUtils.lerp(this.spaceship.rotation.x, targetTiltX, tiltFactor);
    }
  }
}
