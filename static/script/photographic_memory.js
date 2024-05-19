const questions = [
    {
        img: 'static/images/photo_memory/taxi.jpg',
        question: 'Kolik stromů je na obrázku?',
        options: ['2', '3', '4'],
        correct: 0
    },
    {
        img: 'static/images/photo_memory/beach.jpg',
        question: 'Kolik padákových kluzáků je na obrázku?',
        options: ['1', '2', '3'],
        correct: 1
    },
    // Add 8 more question objects with img, question, options, and correct index
];

let currentQuestion = 0;
let score = 0;

const pictureElement = document.getElementById('picture');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const scoreElement = document.querySelector('.score');

function showPicture() {
    pictureElement.src = questions[currentQuestion].img;
    pictureElement.style.display = 'block';
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    setTimeout(showQuestion, 2000);
}

function showQuestion() {
    pictureElement.style.display = 'none';
    questionElement.textContent = questions[currentQuestion].question;
    questionElement.style.display = 'block';
    optionsElement.innerHTML = '';
    questions[currentQuestion].options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option;
        optionElement.classList.add('option');
        optionElement.addEventListener('click', () => checkAnswer(index));
        optionsElement.appendChild(optionElement);
    });
    optionsElement.style.display = 'block';
}

function checkAnswer(selected) {
    if (selected === questions[currentQuestion].correct) {
        score++;
    }
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showPicture();
    } else {
        showScore();
    }
}

function showScore() {
    pictureElement.style.display = 'none';
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    scoreElement.textContent = `Your score: ${score} out of ${questions.length}`;
    scoreElement.style.display = 'block';
}

// Start the quiz
showPicture();
