        let score = 0;
        let questionCount = 0;
        const questions = [
           {
                question: "8 10 14 18 (?) 34 50 66",
                options: ["20", "26", "28"],
                answer: 1
            },
            {
                question: "16 (31) 47 21 (?) 48",
                options: ["25", "28", "27"],
                answer: 2
            },
            {
                question: " 7 9 8 6 10 9 5 11 10 (?) 12",
                options: ["3", "2", "4"],
                answer: 2
            },
            {
                question: " (?) 9 27 81",
                options: ["3", "2", "6"],
                answer: 0
            },
            {
                question: "144, (?), 206, 240",
                options: ["158", "162", "174"],
                answer: 2
            },

           {
                question: "16, 64, (?), 1024, 4096",
                options: ["154", "168", "256"],
                answer: 2
            },
            {
                question: " 56, 75, 94, (?) , 132",
                options: ["93", "89", "113"],
                answer: 2
            },

            {
                question: " 19, 57, (?), 513",
                options: ["97", "121", "171"],
                answer: 2
            },

            {
                question: " 2448, 408, 68, (?)",
                options: ["9", "12", "17"],
                answer: 2
            },

           {
                question: "68, (?), 86, 95, 104",
                options: ["79", "69", "77"],
                answer: 2
            },

            {
                question: "-9, -6, -3, (?), 3",
                options: ["2", "-2", "0"],
                answer: 2
            },

            //https://ays-pro.com/blog/iq-test-questions-with-correct-answers otazka 11
        ];

        function startQuiz() {
            score = 0;
            questionCount = 0;
            document.getElementById('scoreValue').innerText = score + '/' + questions.length;
            generateQuestion();
        }

        function generateQuestion() {
            const currentQuestion = questions[questionCount];
            document.getElementById('question').innerText = currentQuestion.question;

            const options = currentQuestion.options.sort(() => Math.random() - 0.5);
            const buttons = document.querySelectorAll('.option');

            buttons.forEach((button, index) => {
                button.innerText = options[index];
                button.disabled = false; // Re-enable buttons
                button.style.backgroundColor = ''; // Clear background color
            });
        }

        function checkAnswer(index) {
            const selectedAnswer = document.querySelectorAll('.option')[index].innerText;
            const currentQuestion = questions[questionCount];
            const correctAnswer = currentQuestion.options[currentQuestion.answer];

            if (selectedAnswer === correctAnswer) {
                score++;
            }

            questionCount++;
            document.getElementById('scoreValue').innerText = score + '/' + questions.length;

            // Disable buttons after selection
            document.querySelectorAll('.option').forEach(button => button.disabled = true);

            if (questionCount < questions.length) {
                setTimeout(generateQuestion, 1000); // Wait for 1 second before generating next question
            } else {
                endQuiz();
            }
        }

        function endQuiz() {
            document.getElementById('score').innerHTML = 'Váš výsledek: ' + score + '/' + questions.length; // Display final score
        }

        // Start the quiz
        startQuiz();