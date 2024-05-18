  var symbols = [
    { symbol: "⚫", key: " ", name: "black circle" },
    { symbol: "⚪", key: "q", name: "white circle" },
    { symbol: "⬛", key: "p", name: "black square" },
    { symbol: "⬜", key: "z", name: "white square" },
    { symbol: "🔵", key: "m", name: "blue circle" }
  ];
  var symbolElement = document.getElementById("symbol");
  var instructionElement = document.getElementById("instruction");
  var scoreElement = document.getElementById("score");
  var totalAttempts = 0;
  var successfulAttempts = 0;
  var timeoutId;

  function startTask() {
    if (totalAttempts < 20) {
      totalAttempts++;
      var randomIndex = Math.floor(Math.random() * symbols.length);
      var currentSymbol = symbols[randomIndex];
      symbolElement.textContent = currentSymbol.symbol;
      instructionElement.textContent = "Press \"" + currentSymbol.key.toUpperCase() + "\" when you see a " + currentSymbol.name;
      instructionElement.style.display = "block";
      timeoutId = setTimeout(function() {
        endAttempt(false);
      }, 1000); // Wait for 1 second before ending the attempt
      document.addEventListener('keydown', keyboardHandler);
    } else {
      endTask();
    }
  }

  function keyboardHandler(e) {
    var keyPressed = e.key.toLowerCase();
    var symbol = symbolElement.textContent;
    var correctKey = symbols.find(function(symbolObj) {
      return symbolObj.symbol === symbol;
    }).key.toLowerCase();
    if (keyPressed === correctKey) {
      endAttempt(true);
    }
  }

  function endAttempt(success) {
    clearTimeout(timeoutId);
    if (success) {
      successfulAttempts++;
    }
    scoreElement.textContent = "Score: " + successfulAttempts;
    document.removeEventListener('keydown', keyboardHandler);
    setTimeout(startTask, 1000); // Wait for 1 second before starting the next attempt
  }

  function endTask() {
    symbolElement.textContent = "Task completed!";
    instructionElement.textContent = "Your final score is: " + successfulAttempts;
    instructionElement.style.display = "block";
  }

  window.onload = startTask;