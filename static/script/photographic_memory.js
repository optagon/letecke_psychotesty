  var questions = [
    { image: "static/images/photo_memory/beach.jpg", question: "Kolik padákových kluzáků bylo v pozadí?", options: ["3", "4", "2"], correctAnswer: 2 },
    { image: "static/images/photo_memory/obchodnik.jpg", question: "Kolik plastových kyblíků měl obchodník na vozíku?", options: ["4", "3", "2"], correctAnswer: 1 },
    { image: "static/images/photo_memory/people.jpg", question: "Kolik lidí bylo na obrázku?", options: ["5", "6", "7"], correctAnswer: 1 },
    { image: "static/images/photo_memory/taxi.jpg", question: "Kolik stromů bylo na obrázku?", options: ["5", "3", "4"], correctAnswer: 1 },
    // Add more questions as needed
  ];
  var currentIndex = 0;
  var score = 0;

  function startTest() {
    if (currentIndex < questions.length) {
      var currentQuestion = questions[currentIndex];
      document.getElementById("image").src = currentQuestion.image;
      document.getElementById("question").textContent = currentQuestion.question;
      document.getElementById("image-container").style.display = "block";
      document.getElementById("question-container").style.display = "none";
      setTimeout(showNextQuestion, 2000);
    } else {
      endTest();
    }
  }

  function showNextQuestion() {
    document.getElementById("image-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    var currentQuestion = questions[currentIndex];
    var options = document.querySelectorAll(".option");
    for (var i = 0; i < options.length; i++) {
      options[i].textContent = currentQuestion.options[i];
    }
  }

  function checkAnswer(selectedAnswerIndex) {
    var currentQuestion = questions[currentIndex];
    if (selectedAnswerIndex === currentQuestion.correctAnswer) {
      score++;
    }
    document.getElementById("score").textContent = "Score: " + score;
    currentIndex++;
    startTest();
  }

  function endTest() {
    alert("Test dokončen! Vaše úspěšnost je " + score);
  }

  window.onload = startTest;