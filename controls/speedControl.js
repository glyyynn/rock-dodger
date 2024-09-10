export default SpeedControl = (asteroidSpeed) => {
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '1';
    speedControl.max = '20';
    speedControl.value = asteroidSpeed;
    speedControl.style.position = 'absolute';
    speedControl.style.top = '40px';
    speedControl.style.right = '10px';

    return speedControl;
}