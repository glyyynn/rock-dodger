import { Asteroid } from './Asteroid';  // Import the Asteroid class
import { getBoundedRandom } from '../helpers/math';

class AsteroidManager {
  constructor(asteroidMeshes, scene) {
    this.asteroidMeshes = asteroidMeshes;  // The loaded asteroid meshes
    this.scene = scene;
    this.asteroids = [];  // Array to store the active asteroids
  }

  // General asteroid creation logic with a type parameter
  createAsteroid(type) {
    const randomIndex = Math.floor(Math.random() * this.asteroidMeshes.length);
    const mesh = this.asteroidMeshes[randomIndex];

    let asteroid;

    if (type === 'aesthetic') {
      asteroid = new Asteroid(mesh, this.scene);  // Use the Asteroid constructor
      asteroid.mesh.scale.set(  // Set scale specific to aesthetic asteroids
        Math.random() * (20 - 6) + 6,
        Math.random() * (20 - 6) + 6,
        Math.random() * (20 - 6) + 6
      );
      
      asteroid.mesh.position.set(
        (Math.random() - 0.5) * 20000,  // Narrower range for gameplay asteroids
        (Math.random() - 0.5) * 20000,
        9000  // Z-axis remains constant
      );

    } else if (type === 'bigger_aesthetic') {
      const baseScale = Math.random() * (60 - 15) + 15;
      asteroid = new Asteroid(mesh, this.scene);  // Use the Asteroid constructor
      asteroid.mesh.scale.set(baseScale, baseScale, baseScale);
  
      asteroid.mesh.position.set(
        (Math.random() - 0.5) * 20000,  // Narrower range for gameplay asteroids
        (Math.random() - 0.5) * 20000,
        9000  // Z-axis remains constant
      );
    } else if (type === 'gameplay') {
      const baseScale = Math.random() * (120 - 40) + 40;  // Larger gameplay asteroids

      asteroid = new Asteroid(mesh, this.scene);  // Use the Asteroid constructor
      asteroid.mesh.scale.set(baseScale, baseScale, baseScale);

      asteroid.mesh.position.set(
        (Math.random() - 0.5) * 10000,  // Narrower range for gameplay asteroids
        (Math.random() - 0.5) * 10000,
        9000  // Start closer to the spaceship
      );
    }

    this.asteroids.push(asteroid);  // Add asteroid to the active list
    // asteroid.mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    // // asteroid.mesh.rotation.set(asteroid.rotationSpeed.x, asteroid.rotationSpeed.y, asteroid.rotationSpeed.z);
    // this.scene.add(asteroid.mesh);
    // this.asteroids.push(asteroid);
  }

  // Function to update all asteroids
  updateAsteroids() {
    this.asteroids = this.asteroids.filter(asteroid => {
      const isActive = asteroid.move(15);  // Move the asteroid towards the player and check if it's still active
      return isActive;  // Keep active asteroids in the array
    });
  }

  // Centralized method to handle asteroid creation based on probabilities
  spawnAsteroids() {
    const random = Math.random();
    
    // 70% chance for aesthetic asteroid, 15% for bigger aesthetic, 5% for gameplay asteroid
    if (random < 0.65) {
      this.createAsteroid('aesthetic');
    // } else if(random > 0.70 && random < 0.85) {
    //   this.createAsteroid('bigger_aesthetic');
    } else if (random > 0.65 && random < 0.90) {
      this.createAsteroid('bigger_aesthetic');
    } else {
      this.createAsteroid('gameplay');
    }
  }
}

export { AsteroidManager };
