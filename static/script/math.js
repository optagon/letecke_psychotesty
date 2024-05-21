let score = 0;
let questionCount = 0;
let correctAnswer = 0;

function startQuiz() {
    score = 0;
    questionCount = 0;
    document.getElementById('scoreValue').innerText = score + '/' + questionCount;
    generateQuestion();
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 * num2; // Store correct answer
    const wrongAnswers = [
        correctAnswer - Math.floor(Math.random() * 50) - 1,
        correctAnswer + Math.floor(Math.random() * 5) + 1
    ];

    document.getElementById('question').innerText = num1 + ' * ' + num2 + ' = ?';

    const options = [correctAnswer, wrongAnswers[0], wrongAnswers[1]].sort(() => Math.random() - 0.5);
    const buttons = document.querySelectorAll('.option');

    buttons.forEach((button, index) => {
        button.innerText = options[index];
        button.disabled = false; // Re-enable buttons
        button.style.backgroundColor = ''; // Clear background color
    });
}

function checkAnswer(index) {
    const selectedAnswer = document.querySelectorAll('.option')[index].innerText;

    if (parseInt(selectedAnswer) === correctAnswer) {
        score++;
    }

    questionCount++;
    document.getElementById('scoreValue').innerText = score + '/' + questionCount;

    // Disable buttons after selection
    document.querySelectorAll('.option').forEach(button => button.disabled = true);

    if (questionCount < 10) {
        setTimeout(generateQuestion, 1000); // Wait for 1 second before generating next question
    } else {
        endQuiz();
    }
}

function endQuiz() {
    const correctPercentage = (score / questionCount) * 100;
    const incorrectPercentage = ((questionCount - score) / questionCount) * 100;
    document.getElementById('score').innerHTML = `Vaše úspěšnost: ${score}/10<br>
        Správných odpovědí: ${correctPercentage.toFixed(2)}%<br>
        Špatných odpovědí: ${incorrectPercentage.toFixed(2)}%`;
}

// Start the quiz
startQuiz();
