const symbols = document.querySelectorAll('.symbol');
const audio1 = document.getElementById('audio1');
const audio2 = document.getElementById('audio2');

const keyMap = {
    green: 'Q',
    yellow: 'P',
    blue: 'A',
    orange: 'L',
    audio1: 'F',
    audio2: 'H'
};

let timeOnScreen = 1000;
const testDuration = 300000; // 5 minutes in milliseconds
const symbolDisplayDurationDecrease = 100; // Decrease time on screen by 100ms after each iteration
let testStartTime = Date.now();

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showRandomSymbol() {
    const remainingTime = testStartTime + testDuration - Date.now();
    if (remainingTime <= 0) {
        alert('Test is over!');
        return;
    }

    symbols.forEach(symbol => symbol.style.display = 'none');
    
    const symbol = getRandomElement(symbols);
    symbol.style.display = 'flex';

    setTimeout(() => {
        symbol.style.display = 'none';
    }, timeOnScreen);

    if (Math.random() < 0.5) { // 50% chance to play an audio
        const audio = Math.random() < 0.5 ? audio1 : audio2;
        audio.play();
    }

    timeOnScreen = Math.max(500, timeOnScreen - symbolDisplayDurationDecrease);

    setTimeout(showRandomSymbol, timeOnScreen);
}

function handleKeyPress(event) {
    const pressedKey = event.key.toUpperCase();
    const correctKey = getRandomElement(Object.values(keyMap));
    const symbol = document.querySelector(`.symbol:contains(${correctKey})`);

    if (pressedKey === correctKey) {
        console.log('Correct key pressed!');
    } else {
        console.log('Incorrect key pressed.');
    }
}

document.addEventListener('keydown', handleKeyPress);

showRandomSymbol();
