import * as THREE from 'three';

class Camera {
  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 10000) {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, -40);  // Start at a position behind the spaceship
    
    this.offset = new THREE.Vector3(0, 10, -40);  // Set offset from the spaceship

    // Add the follow method directly to the camera object
    camera.follow = (target) => {
      const targetPosition = target.position.clone().add(this.offset);

      camera.position.copy(targetPosition);  // Set the camera position to the target position
      // camera.position.lerp(targetPosition, lerpFactor);  // Smoothly interpolate the camera
      camera.lookAt(target.position);  // Keep the camera looking at the spaceship
    };

    // Handle resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return camera;  // Return the camera object with the follow method attached
  }
}

export { Camera };
