export function StartButton() {
    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.position = 'absolute';
    startButton.style.top = '50%';
    startButton.style.left = '50%';
    startButton.style.transform = 'translate(-50%, -50%)';
    startButton.style.padding = '20px';
    startButton.style.fontSize = '24px';
    startButton.style.color = 'white';
    startButton.style.background = 'url("space-theme-bg.jpg") no-repeat center';
    startButton.style.border = '2px solid white';
    startButton.style.borderRadius = '10px';
    startButton.style.cursor = 'pointer';

    return startButton;
}