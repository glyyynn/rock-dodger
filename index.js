import * as THREE from 'three';
import { scene, renderer, camera } from './core/index.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { StartButton } from './controls/startButton';
import { Spaceship } from './objects/spaceship.js';  // Import the Spaceship class
import { AsteroidManager } from './objects/AsteroidManager.js';  // Import the AsteroidManager class
import { loadAsteroids } from './models/loadAsteroids.js';  // Import the loadAsteroids function
import { setupInputControls, moveLeft, moveRight, moveUp, moveDown } from './controls/inputControls';
import { createHUD, updateTimer } from './hud/hud.js';
import Stats from 'stats.js';

// Initialize Stats.js
const stats = new Stats();
stats.showPanel(2);  // 0: FPS, 1: ms/frame, 2: memory usage (if supported)
document.body.appendChild(stats.dom);  // Add stats display to the DOM

// Create and initialize the HUD
const { timerElement } = createHUD();
updateTimer(timerElement);

// Set up the scene, camera, and renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Add OrbitControls for better control of the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.zoomSpeed = 1.0;
controls.enableRotate = true;
controls.enablePan = false;

// Position the camera inside the space skybox
camera.position.set(0, 15, 30);
controls.update();

// Create and add the space background
const textureLoader = new THREE.TextureLoader();
textureLoader.load('assets/spacebox/textures/lambert1_emissive.jpeg', (texture) => {
  const spaceGeometry = new THREE.SphereGeometry(9000, 60, 40);
  const spaceMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  });
  const spaceSphere = new THREE.Mesh(spaceGeometry, spaceMaterial);
  scene.add(spaceSphere);
  renderer.render(scene, camera);  // Initial render of the scene before game starts
});

/* Spaceship */
// Load the spaceship model
const spaceshipPath = 'assets/sf_light-_fighter_x6/scene.gltf';
const spaceship = new Spaceship(scene, spaceshipPath);  // Create a spaceship instance

// Load the spaceship immediately so it's visible before the start button is pressed
spaceship.load()
  .then(() => {
    console.log('Spaceship loaded');
    renderer.render(scene, camera);  // Ensure spaceship is rendered
  })
  .catch((error) => {
    console.error('Error loading spaceship:', error);
  });

/* Game logic */
let asteroidManager = null;
let gameStarted = false;  // State to track if the game has started

// Main animation loop
function animate() {
  stats.begin();  // Begin measuring stats
  requestAnimationFrame(animate);
  if (gameStarted) {
    // Move the spaceship based on input controls
    spaceship.move(moveLeft, moveRight, moveUp, moveDown);

    // Make the camera follow the spaceship
    camera.follow(spaceship.spaceship);

    // Update asteroid positions
    if (asteroidManager) {
      asteroidManager.updateAsteroids();
    }
  }

  // Render the scene
  renderer.render(scene, camera);
  stats.end();  // End measuring stats
}

setupInputControls();  // Initialize input controls

// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

/* Start button and game start animation */
const startButton = StartButton();
document.body.appendChild(startButton);

renderer.shadowMap.enabled = false;

startButton.addEventListener('click', () => {
  document.body.removeChild(startButton);

  // Initial and target camera positions
  const startPosition = { x: 0, y: 15, z: 40 };  // Starting in front of the spaceship
  const endPosition = { x: 0, y: 15, z: -40 };  // Ending behind the spaceship
  const sideRadiusX = 30;  // X radius for elliptical motion to create side view effect

  const totalDuration = 3000;  // Duration of the animation in milliseconds
  let startTime = null;

  function animateCamera(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    const t = Math.min(elapsedTime / totalDuration, 1);

    const angle = Math.PI * t;
    camera.position.x = sideRadiusX * Math.sin(angle)
    camera.position.y = THREE.MathUtils.lerp(startPosition.y, endPosition.y, t);
    camera.position.z = THREE.MathUtils.lerp(startPosition.z, endPosition.z, t);
    camera.lookAt(spaceship.spaceship.position);

    renderer.render(scene, camera);  // Ensure the camera is rendered during each frame

    if (t < 1) {
      requestAnimationFrame(animateCamera);  // Continue animation if time hasn't reached 1
    } else {
      gameStarted = true;  // Mark the game as started

      // Load asteroids into the scene
      const asteroidPath = 'assets/asteroids_pack_metallic_version/scene.gltf';

      loadAsteroids(asteroidPath)
        .then((asteroidMeshes) => {
          asteroidManager = new AsteroidManager(asteroidMeshes, scene);  // Initialize AsteroidManager

          // Use a single interval for spawning both types of asteroids
          setInterval(() => asteroidManager.spawnAsteroids(), 4);

          // Start the main game loop after camera animation is complete
        })
        .catch((error) => {
          console.error('Failed to load asteroids:', error);
        });

      // Start the animation loop (the camera follow happens once the game starts)
      animate();

      return gameStarted;
    }
  }

  requestAnimationFrame(animateCamera);  // Start the camera animation
});

renderer.render(scene, camera);  // Initial render to ensure something appears
