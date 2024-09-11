import * as THREE from 'three';

class Asteroid {
  constructor(mesh, scene) {
    this.mesh = mesh.clone();  // Clone the original mesh for this instance
    this.scene = scene;

    // Set random scale, keeping it more balanced
    const baseScale = Math.random() * (20 - 10) + 10;  // Moderate the base scale range to avoid extreme sizes
    this.mesh.scale.set(baseScale, baseScale, baseScale);  // Set the same scale for all axes to keep it balanced

    // Set random position and rotation
    this.mesh.position.set(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000,
      3000
    );
    this.mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    // Define a random rotation speed for each axis (for spinning effect)
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,  // Random small rotation speed on X axis
      y: (Math.random() - 0.5) * 0.01,  // Random small rotation speed on Y axis
      z: (Math.random() - 0.5) * 0.01   // Random small rotation speed on Z axis
    };

    this.scene.add(this.mesh);  // Add asteroid to the scene
  }

  // Move the asteroid and rotate it to simulate spinning
  move(speed) {
    this.mesh.position.z -= speed;  // Move the asteroid along the Z axis (towards the camera)

    // Apply rotation for spinning effect
    this.mesh.rotation.x += this.rotationSpeed.x;
    this.mesh.rotation.y += this.rotationSpeed.y;
    this.mesh.rotation.z += this.rotationSpeed.z;

    // Remove asteroid if it's out of bounds
    if (this.mesh.position.z < -2000) {
      this.scene.remove(this.mesh);  // Remove from scene
      return false;  // Indicate that the asteroid should be removed from the array
    }
    return true;  // Asteroid is still active
  }
}

export { Asteroid };
