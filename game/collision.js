import * as THREE from 'three';

function checkCollisions(spaceship, asteroids, scene) {
  const spaceshipBox = new THREE.Box3().setFromObject(spaceship.spaceship);
  
  asteroids.forEach((asteroid) => {
    const asteroidBox = new THREE.Box3().setFromObject(asteroid.mesh);
    
    if (spaceshipBox.intersectsBox(asteroidBox)) {
      triggerGameOver(spaceship, scene);
    }
  });
}

function triggerGameOver(spaceship, scene) {
  spaceship.spaceship.scale.set(2, 2, 2);
  setTimeout(() => spaceship.spaceship.scale.set(0, 0, 0), 500);

  const dialog = document.createElement('div');
  dialog.innerHTML = `<div style="background: url('space-theme-bg.jpg'); color: white; padding: 20px;">
                        Game Over! <br>
                        Your Score: <span id="score"></span> seconds <br>
                        <button id="retryButton">Try Again</button>
                      </div>`;
  dialog.style.position = 'absolute';
  dialog.style.top = '50%';
  dialog.style.left = '50%';
  dialog.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(dialog);

  document.getElementById('retryButton').addEventListener('click', () => location.reload());
}

export { checkCollisions };
