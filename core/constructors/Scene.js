import * as THREE from 'three';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();

    // Add default lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const spotlight = new THREE.SpotLight(0xffffff, 1.5);
    spotlight.position.set(-10, 10, -10);
    spotlight.castShadow = true;
    this.scene.add(spotlight);
  }

  getScene() {
    return this.scene;
  }
}

export { Scene };
