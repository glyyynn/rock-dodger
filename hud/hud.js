let timer = 0;
let asteroidSpeed = 5;

function createHUD() {
  const timerElement = document.createElement('div');
  timerElement.style.position = 'absolute';
  timerElement.style.top = '10px';
  timerElement.style.right = '10px';
  timerElement.style.color = 'white';
  document.body.appendChild(timerElement);

  const speedControl = document.createElement('input');
  speedControl.type = 'range';
  speedControl.min = '1';
  speedControl.max = '20';
  speedControl.value = asteroidSpeed;
  speedControl.style.position = 'absolute';
  speedControl.style.top = '40px';
  speedControl.style.right = '10px';
  document.body.appendChild(speedControl);

  speedControl.addEventListener('input', (event) => {
    asteroidSpeed = event.target.value;
  });

  return { timerElement, speedControl };
}

function updateTimer(timerElement) {
  setInterval(() => {
    timer++;
    timerElement.innerText = `Time Survived: ${timer}s`;
  }, 1000);
}

export { createHUD, updateTimer, asteroidSpeed };
