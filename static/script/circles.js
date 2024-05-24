// these guys should be always constant
const whiteColor = "rgb(255, 255, 255)";
const blackColor = "rgb(0, 0, 0)";
const nCircles = 30;
const circOffset = 30;
const interval = 1000;


function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getCanvasCenter(canvas) {
    return {
      x: canvas.width / 2,
      y: canvas.height / 2,
    }
}

function resizeCanvas() {
  display.canvas.width = window.innerWidth * 0.6;
  display.canvas.height = window.innerHeight * 0.6;
  console.log("canvas resized to: " + display.canvas.width + " " + display.canvas.height);
  display.redraw();
}

const display = {
  canvas: document.getElementById("myCanvas"),
  ctx: document.getElementById("myCanvas").getContext("2d"),

  initialize: function() {
    this.drawBackground();
    this.drawCircles(0);
  },

  redraw: function() {
    this.drawBackground();
    this.drawCircles(step);
  },

  drawBackground: function() {
    this.ctx.fillStyle = blackColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawCircle: function(centerX, centerY, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = whiteColor;
    this.ctx.stroke();
  },

  drawCircles: function(nFilled) {
    canvasCenter = getCanvasCenter(this.canvas);
    const bradius = canvasCenter.x * 0.5 - 50;
    let circumference = 2 * Math.PI * bradius;
    let sradius = (circumference - nCircles * circOffset) / nCircles / 2;

    if (sradius < 10) {
      sradius = 10;
    }

    let dfi = 360 / nCircles;

    for (let n = 0; n < nCircles; n++) {
      let fi = n * dfi;
      let cx = canvasCenter.x + bradius * Math.cos(deg2rad(fi));
      let cy = canvasCenter.y + bradius * Math.sin(deg2rad(fi));

      if (n == nFilled) {
        this.drawCircle(cx, cy, sradius, whiteColor);
      } else {
        this.drawCircle(cx, cy, sradius, blackColor);
      }

    }
   },

   printResults: function(resString) {
     this.ctx.fillStyle = whiteColor;
     this.ctx.font = "bold 18px Arial";
     this.ctx.fillText(resString, 30, 30);
   }

}


const controls = {
  timeSelect: document.getElementById("timeSelect"),
  timeInfo: document.getElementById("timeInfo"),
  startStopBtn: document.getElementById("startStopBtn"),
  registerBtn: document.getElementById("registerBtn"),

  runStarted: function() {
    this.timeSelect.disabled = true;
    this.registerBtn.disabled = false;
    this.startStopBtn.innerHTML = "STOP";
  },

  runFinished: function() {
    this.writeTimeString(timeLimit);
    this.timeSelect.disabled = false;
    this.registerBtn.disabled = true;
    this.startStopBtn.innerHTML = "START";
  },

  disableAll: function () {
    this.timeSelect.disabled = true;
    this.registerBtn.disabled = true;
    this.startStopBtn.disabled = true;
  },

  writeTimeString: function(nSeconds) {
    secs = nSeconds % 60;
    mins = Math.floor(nSeconds / 60);

    this.timeInfo.innerHTML = this.padNumToStr(mins) + ":" + this.padNumToStr(secs);
  },

  padNumToStr: function(num) {
    if (num < 10){
      return "0" + num.toString();
    }
    return num.toString();
  },

}

function startStopBtnCb() {
  if (run) {     // stop the run
    clearInterval(currInterval);
    // with pop up no need to rejuvenate
    //controls.runFinished();
    controls.disableAll();
    game.showResults();
    elapsedTime = 0;
    run = false;
  } else {      // start the run
    game.initialize();
    currInterval = setInterval(game.gameStep, interval);
    controls.runStarted();
    run = true;
  }
}

function registerBtnCb(el) {
  resultStats.registerBtnPush();
  resultStats.print();
}

function timeSelectCb(selectObject){
  elapsedTime = 0;

  let val = selectObject.value;
  switch(val) {
    case "01:00":
      timeLimit = 60;
      break;
    case "05:00":
      timeLimit = 5 * 60;
      break;
    case "10:00":
      timeLimit = 10 * 60;
      break;
    case "20:00":
      timeLimit = 20 * 60;
      break;
    default:
      timeLimit = 60;
  }

  console.log("Chosen " + timeLimit + " time limit");
  controls.writeTimeString(timeLimit);

}

const resultStats = {
  correctlyRegistered: 0,
  incorrectlyRegistered: 0,
  nSkippings: 0,

  reload: function() {
    this.correctlyRegistered = 0;
    this.incorrectlyRegistered = 0;
    this.nSkippings = 0;
  },

  registerBtnPush: function() {
    if (skipping){
      this.correctlyRegistered++;
    } else {
      this.incorrectlyRegistered++;
    }
  },

  registerSkipping: function(){
    this.nSkippings++;
  },

  print: function() {
    console.log("Number of skips: " + this.nSkippings);
    console.log("Correct registers: " + this.correctlyRegistered);
    console.log("Incorrect registers: " + this.incorrectlyRegistered);
  },

  toString: function() {
    let s = "Results: <br>";
    s = s + "Number of skips: " + this.nSkippings + " <br>";
    s = s + "Correct hits: " + this.correctlyRegistered + " <br>";
    s = s + "Incorrect hits: " + this.incorrectlyRegistered + " <br>";
    s = s + "Missed skips: " + (this.nSkippings - this.correctlyRegistered) + " <br>";
    return s
  }

}


const game = {
  controls: controls,
  results: resultStats,
  displayer: display,
  resultElement: document.getElementById("results-container"),
  resultText: document.getElementById("results-text"),

  initialize: function() {
    this.displayer.initialize();
    this.controls.runFinished();
    this.results.reload();
    elapsedTime = 0;
  },

  circleStep: function() {
    if ((step + 1) >= nCircles) {
      step = 0;
    } else {
      step = step + 1;
    }
  },

  oneOrTwoSteps: function() {
    skipping = false;
    if (Math.random() < skipProb){
      this.circleStep();
      skipping = true;
      this.results.registerSkipping();
    }
    this.circleStep();
  },

  gameStep: function() {
    elapsedTime++;
    console.log("limit " + timeLimit)
    console.log("elapsed " + elapsedTime)
    controls.writeTimeString(timeLimit - elapsedTime);

    if ((timeLimit - elapsedTime) <= 0) {
      startStopBtnCb();
      return;
    }

    game.oneOrTwoSteps();
    game.displayer.drawCircles(step);
  },

  showResults: function() {
    this.resultElement.style.display = "block";
    this.resultText.innerHTML = this.results.toString();
  }

}


step = 0;
var currInterval;
var timeLimit = 60;
var elapsedTime = 0;
var skipProb = 0.2;
var skipping = false;

run = Boolean(false);
/*window.addEventListener('resize', resizeCanvas, false);
game.initialize();*/

window.addEventListener('resize', resizeCanvas, false);
document.addEventListener('DOMContentLoaded', (event) => {
  resizeCanvas();
  game.initialize();
});