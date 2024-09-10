import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function loadAsteroids(asteroidPath) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(asteroidPath, (gltf) => {
      const asteroidMeshes = [];
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          asteroidMeshes.push(child.clone());
        }
      });
      resolve(asteroidMeshes);  // Return the loaded meshes
    }, undefined, reject);
  });
}

export { loadAsteroids };
