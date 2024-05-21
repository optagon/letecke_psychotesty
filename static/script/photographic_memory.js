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
    {
        img: 'static/images/photo_memory/car.png',
        question: 'Jaká barva vozidla nebyla na obrázku?',
        options: ['modrá', 'žlutá', 'stříbrná'],
        correct: 1
    },
        {
        img: 'static/images/photo_memory/vozidla.png',
        question: 'Kolik vozidel je na obrázku?',
        options: ['3', '4', '6'],
        correct: 1
    },
    {
        img: 'static/images/photo_memory/vozidla.png',
        question: 'Kolik vozidel je na obrázku?',
        options: ['3', '4', '6'],
        correct: 1
    },
    {
        img: 'static/images/photo_memory/majak.png',
        question: 'Jakou barvu má maják?',
        options: ['červeno-žlutý', 'červeno-bílý', 'černo-bílý'],
        correct: 2
    },
    {
        img: 'static/images/photo_memory/fotbal.png',
        question: 'Jakou barvu dresů neměl ani jeden tým na obrázku?',
        options: ['oranžovo-bílý', 'modro-bílý', 'černo-bílý'],
        correct: 2
    },
    {
        img: 'static/images/photo_memory/kone.png',
        question: 'Kolik je na obrázku koní?',
        options: ['5', '6', '7'],
        correct: 0
    },
    {
        img: 'static/images/photo_memory/lod.png',
        question: 'Jak se jmenuje loď na obrázku?',
        options: ['S.S Hurricane Camille', 'S.S Hurricane Kathrina', 'S.S Gulfport'],
        correct: 0
    },
    {
        img: 'static/images/photo_memory/rybar.png',
        question: 'Jakou barvu mají rukavice rybáře?',
        options: ['černou', 'oranžovou', 'červenou'],
        correct: 1
    },
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
    scoreElement.textContent = `Zodpovězeno správně ${score} z ${questions.length} otázek`;
    scoreElement.style.display = 'block';
}

// Start the quiz
showPicture();
