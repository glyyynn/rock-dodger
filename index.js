import * as THREE from 'three';
import { scene, renderer, camera } from './core/index.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { StartButton } from './controls/startButton';
import { Spaceship } from './objects/spaceship.js';  // Import the Spaceship class
import { AsteroidManager } from './objects/AsteroidManager.js';  // Import the AsteroidManager class
import { loadAsteroids } from './models/loadAsteroids.js';  // Import the loadAsteroids function
import { setupInputControls, moveLeft, moveRight, moveUp, moveDown } from './controls/inputControls';
import { createHUD, updateTimer, asteroidSpeed } from './hud/hud.js';
import { checkCollisions } from './game/collision.js';
import Stats from 'stats.js'; // Import Stats.js

// Initialize Stats.js
const stats = new Stats();
stats.showPanel(2);  // 0: FPS, 1: ms/frame, 2: memory usage (if supported)
document.body.appendChild(stats.dom);  // Add stats display to the DOM


// Initialize input controls
setupInputControls();
// Create and initialize the HUD
const { timerElement } = createHUD();
updateTimer(timerElement);





// Set up the scene, camera, and renderer
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });
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
// Spaceship path
const spaceshipPath = 'assets/sf_light-_fighter_x6/scene.gltf';
const spaceship = new Spaceship(scene, spaceshipPath);  // Create a spaceship instance

// Load the spaceship
spaceship.load()
  .then(() => {
    // Render the scene after spaceship is loaded
    renderer.render(scene, camera);
  })
  .catch((error) => {
    console.error('Failed to load spaceship:', error);
  });
// Animation loop
function animate(asteroidManager) {
  stats.begin();  // Begin measuring frame time with Stats.js
  requestAnimationFrame(() => animate(asteroidManager));  // Continue the loop

  // Move the spaceship
  spaceship.move(moveLeft, moveRight, moveUp, moveDown);  // Use the spaceship class for movement

  // Update the asteroid positions
  asteroidManager.updateAsteroids();  // Update asteroid positions every frame

  controls.update();
  
  // Render the scene
  renderer.render(scene, camera);

  stats.end();  // End measuring frame time with Stats.js
}




// Handle window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});





/* Game logic */
// Start button and game start animation
const startButton = StartButton();
document.body.appendChild(startButton);

renderer.shadowMap.enabled = false;

startButton.addEventListener('click', () => {
  document.body.removeChild(startButton);

  // Initial and target camera positions
  const startPosition = { x: 0, y: 15, z: 30 };  // Starting in front of the spaceship
  const endPosition = { x: 0, y: 15, z: -40 };  // Ending behind the spaceship
  const sideRadiusX = 30;  // X radius for elliptical motion to create side view effect

  const totalDuration = 3000;  // Duration of the animation in milliseconds (20 seconds)
  let startTime = null;  // Time when animation starts

  let lastRenderTime = 0;
  let frameNumber = 0;
  let isAnimating = false;  // Guard to prevent re-entrant calls

  function animateCamera(timestamp) {
    if (isAnimating) return;  // Skip this call if already animating

    isAnimating = true;
    frameNumber++;

    // Calculate the time difference (delta) between the current frame and the previous one
    const delta = timestamp - lastRenderTime;
    lastRenderTime = timestamp;  // Update lastRenderTime at the start of the frame

    if (!startTime) startTime = timestamp; // Set the start time if it's the first frame
    const elapsedTime = timestamp - startTime;
    const t = Math.min(elapsedTime / totalDuration, 1);

    const angle = Math.PI * t;  
    camera.position.x = sideRadiusX * Math.sin(angle); 
    camera.position.y = THREE.MathUtils.lerp(startPosition.y, endPosition.y, t);  
    camera.position.z = THREE.MathUtils.lerp(startPosition.z, endPosition.z, t);

    camera.lookAt(spaceship.spaceship.position);

    renderer.render(scene, camera);  // Ensure the camera is rendered during each frame

    if (t < 1) {
      requestAnimationFrame(animateCamera);  // Continue animation if time hasn't reached 1
    } else {
       // Start the game loop after animation completes

      // Load asteroids into the scene
      const asteroidPath = 'assets/asteroids_pack_metallic_version/scene.gltf';
      loadAsteroids(asteroidPath)
        .then((asteroidMeshes) => {
          const asteroidManager = new AsteroidManager(asteroidMeshes, scene);  // Initialize AsteroidManager
          
          // Use a single interval for spawning both types of asteroids
          setInterval(() => asteroidManager.spawnAsteroids(), 25);
      
          // Start the animation loop with the asteroid manager
          requestAnimationFrame(() => animate(asteroidManager));
        })
        .catch((error) => {
          console.error('Failed to load asteroids:', error);
        }); 
    }

    isAnimating = false;
  }

  requestAnimationFrame(animateCamera);  // Start the camera animation
});

renderer.render(scene, camera);  // Initial render to ensure something appears
