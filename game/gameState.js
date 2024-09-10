function startGame(startButton, onGameStart) {
    startButton.addEventListener('click', () => {
      document.body.removeChild(startButton);
      onGameStart();
    });
  }
  
  export { startGame };
  