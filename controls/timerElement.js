export default TimerElement = (time) => {
    const timerElement = document.createElement('div');
    timerElement.style.position = 'absolute';
    timerElement.style.top = '10px';
    timerElement.style.right = '10px';
    timerElement.style.color = 'white';
    return timerElement;
}