class AsteroidManager {
  constructor(asteroidMeshes, scene) {
    this.asteroidMeshes = asteroidMeshes;  // The loaded asteroid meshes
    this.scene = scene;
    this.asteroids = [];  // Array to store the active asteroids
  }

  // General asteroid creation logic with a type parameter
  createAsteroid(type) {
    const randomIndex = Math.floor(Math.random() * this.asteroidMeshes.length);
    const asteroid = this.asteroidMeshes[randomIndex].clone();

    // Set different properties based on type
    if (type === 'aesthetic') {
      const baseScale = Math.random() * (20 - 6) + 6;  // Larger aesthetic asteroids
      asteroid.scale.set(baseScale, baseScale, baseScale);
      asteroid.position.set(
        (Math.random() - 0.5) * 10000,  // Wider range for aesthetic asteroids
        (Math.random() - 0.5) * 10000,
        5000  // Start further away
      );
    } else if (type === 'gameplay') {
      const baseScale = Math.random() * (40 - 8) + 8;  // Larger gameplay asteroids
      asteroid.scale.set(baseScale, baseScale, baseScale);
      asteroid.position.set(
        (Math.random() - 0.5) * 500,  // Narrower range for gameplay asteroids
        (Math.random() - 0.5) * 500,
        3000  // Start closer to the spaceship
      );
    }

    asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    this.scene.add(asteroid);
    this.asteroids.push(asteroid);
  }

  // Function to update all asteroids
  updateAsteroids() {
    this.asteroids = this.asteroids.filter(asteroid => {
      asteroid.position.z -= 8;  // Move the asteroid towards the player

      // If the asteroid moves out of bounds, remove it from the scene and array
      if (asteroid.position.z < -2000) {
        this.scene.remove(asteroid);
        return false;  // Remove from array
      }

      return true;  // Keep in array
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
