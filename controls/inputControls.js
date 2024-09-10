let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

function setupInputControls() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = true;
    if (event.key === 'ArrowRight' || event.key === 'd') moveRight = true;
    if (event.key === 'ArrowUp' || event.key === 'w') moveUp = true;
    if (event.key === 'ArrowDown' || event.key === 's') moveDown = true;
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'a') moveLeft = false;
    if (event.key === 'ArrowRight' || event.key === 'd') moveRight = false;
    if (event.key === 'ArrowUp' || event.key === 'w') moveUp = false;
    if (event.key === 'ArrowDown' || event.key === 's') moveDown = false;
  });
}

export { setupInputControls, moveLeft, moveRight, moveUp, moveDown };
