import { Asteroid } from './Asteroid';  // Import the Asteroid class

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
        (Math.random() - 0.5) * 10000,  // Wider range for aesthetic asteroids
        (Math.random() - 0.5) * 10000,
        5000  // Start further away
      );
    } else if (type === 'gameplay') {
      const baseScale = Math.random() * (40 - 8) + 8;  // Larger gameplay asteroids

      asteroid = new Asteroid(mesh, this.scene);  // Use the Asteroid constructor
      asteroid.mesh.scale.set(baseScale, baseScale, baseScale);

      // asteroid.mesh.scale.set(  // Set scale specific to gameplay asteroids
      //   Math.random() * (40 - 8) + 8,
      //   Math.random() * (40 - 8) + 8,
      //   Math.random() * (40 - 8) + 8
      // );

      asteroid.mesh.position.set(
        (Math.random() - 0.5) * 500,  // Narrower range for gameplay asteroids
        (Math.random() - 0.5) * 500,
        3000  // Start closer to the spaceship
      );
    }

    this.asteroids.push(asteroid);  // Add asteroid to the active list
    // asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    // this.scene.add(asteroid);
    // this.asteroids.push(asteroid);
  }

  // Function to update all asteroids
  updateAsteroids() {
    this.asteroids = this.asteroids.filter(asteroid => {
      const isActive = asteroid.move(8);  // Move the asteroid towards the player and check if it's still active
      return isActive;  // Keep active asteroids in the array
    });
  }

  // Centralized method to handle asteroid creation based on probabilities
  spawnAsteroids() {
    const random = Math.random();
    
    // 95% chance for aesthetic asteroid, 5% for gameplay asteroid
    if (random < 0.95) {
      this.createAsteroid('aesthetic');
    } else {
      this.createAsteroid('gameplay');
    }
  }
}

export { AsteroidManager };
