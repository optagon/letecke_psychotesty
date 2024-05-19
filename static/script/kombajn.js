    let score = 0;
    let startTime = Date.now();
    const testDuration = 5 * 60 * 1000; // 5 minutes
    const symbols = [
        { class: 'circle top-left', color: 'black', key: 'Q' },
        { class: 'circle top-right', color: 'red', key: 'P' },
        { class: 'rectangle bottom-left', color: 'green', key: 'Z' },
        { class: 'oval bottom-right', color: 'yellow', key: 'M' },
        { class: 'cross', color: 'black', key: null }
    ];
    const audios = [
        { id: 'audio1', key: 'F' },
        { id: 'audio2', key: 'H' }
    ];

    const scoreElement = document.getElementById('score');

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function showSymbol() {
        const randomSymbol = symbols[getRandomInt(symbols.length)];
        const symbolElement = document.createElement('div');
        symbolElement.className = `symbol ${randomSymbol.class}`;
        symbolElement.style.backgroundColor = randomSymbol.color;
        symbolElement.innerHTML = randomSymbol.class.includes('cross') ? '✖' : '';
        document.body.appendChild(symbolElement);

        const displayTime = Math.max(1500 - ((Date.now() - startTime) / 1000 / 5) * 1000, 500);

        let keyPressListener = (event) => {
            if (randomSymbol.key && event.key.toUpperCase() === randomSymbol.key) {
                score++;
            } else if (!randomSymbol.class.includes('cross')) {
                score--;
            } else {
                score--;
            }
            updateScore();
        };

        document.addEventListener('keydown', keyPressListener, { once: true });

        setTimeout(() => {
            if (symbolElement) {
                document.body.removeChild(symbolElement);
            }
            document.removeEventListener('keydown', keyPressListener);
            nextStep();
        }, displayTime);
    }

    function playAudio() {
        const randomAudio = audios[getRandomInt(audios.length)];
        const audioElement = document.getElementById(randomAudio.id);
        audioElement.play();

        let keyPressListener = (event) => {
            if (event.key.toUpperCase() === randomAudio.key) {
                score++;
            } else {
                score--;
            }
            updateScore();
        };

        document.addEventListener('keydown', keyPressListener, { once: true });

        const audioDuration = 1000;
        setTimeout(() => {
            audioElement.pause();
            audioElement.currentTime = 0;
            document.removeEventListener('keydown', keyPressListener);
            nextStep();
        }, audioDuration);
    }

    function nextStep() {
        if (Date.now() - startTime > testDuration) {
            alert(`Test completed! Your final score is: ${score}`);
            return;
        }
        const isAudio = Math.random() < 0.5;
        if (isAudio) {
            playAudio();
        } else {
            showSymbol();
        }
    }

    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }

    nextStep();