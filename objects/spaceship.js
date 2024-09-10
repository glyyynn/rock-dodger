import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Spaceship {
  constructor(scene, spaceshipPath) {
    this.scene = scene;
    this.spaceshipPath = spaceshipPath;
    this.spaceship = null;  // Will hold the loaded spaceship model
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
          this.scene.add(this.spaceship);  // Add spaceship to the scene

          // Apply custom material properties
          this.spaceship.traverse((child) => {
            if (child.isMesh) {
              if (child.material) {
                child.material.metalness = 1;
                child.material.roughness = 0.3;
                child.material.emissive = new THREE.Color(0x222222);
                child.material.emissiveIntensity = 1.5;
                child.material.needsUpdate = true;
              }
            }
          });

          // Create a glowing halo around the spaceship
          const glowTexture = new THREE.TextureLoader().load('path/to/glow_texture.png');
          const glowMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: 0xffffff,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
          });
          const glowSprite = new THREE.Sprite(glowMaterial);
          glowSprite.scale.set(30, 30, 1);
          glowSprite.position.copy(this.spaceship.position);
          this.scene.add(glowSprite);

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

  // Movement logic for the spaceship
  move(left, right, up, down) {
    if (this.spaceship) {
      if (left && this.spaceship.position.x < 50) this.spaceship.position.x += 0.6;
      if (right && this.spaceship.position.x > -50) this.spaceship.position.x -= 0.6;
      if (up && this.spaceship.position.y < 20) this.spaceship.position.y += 0.6;
      if (down && this.spaceship.position.y > -20) this.spaceship.position.y -= 0.6;

      this.spaceship.rotation.z = left ? -0.8 : right ? 0.8 : 0;
      this.spaceship.rotation.x = up ? -0.5 : down ? 0.5 : 0;
    }
  }
}






