const PERIOD_MS = 1000;
const DEFAULT_TIME_LIMIT = 60;

class Grid {

    constructor(nRows, nCols) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.ones = [];
        this.zeroes = [];
        this.rects = [];
        this.initialize();
    }

    initialize() {
        this.arr = [];
        this.blankGrid();
        for (let i = 0; i < this.nRows; i++) {
            this.arr[i] = [];
            for (let j = 0; j < this.nCols; j++) {
                if (Math.random() < 0.3) {
                    this.arr[i][j] = 1;
                    this.ones.push([i, j]);
                }
                else {
                    this.arr[i][j] = 0;
                    this.zeroes.push([i, j]);
                }
            }
        }
        console.log("ONES");
        console.log(this.ones);
    }

    blankGrid() {
        for (let i = 0; i < this.nRows; i++) {
            this.arr[i] = [];
            for (let j = 0; j < this.nCols; j++) {
                this.arr[i][j] = 0;
            }
        }
    }

    step() {
        // one One to Zero
        let idx_rand = Math.round(Math.random() * this.ones.length);
        let posOneToZero = this.ones.splice(idx_rand, 1);
        console.log("KROOO");
        console.log(posOneToZero[0][0] + " || " + posOneToZero[0][1]);
        this.arr[posOneToZero[0][0]][posOneToZero[0][1]] = 0;

        // one Zero to One
        idx_rand = Math.round(Math.random() * this.zeroes.length);
        let posZeroToOne = this.zeroes.splice(idx_rand, 1);
        console.log("MROOO");
        console.log(posZeroToOne[0][0] + " || " + posZeroToOne[0][1]);
        this.arr[posZeroToOne[0][0]][posZeroToOne[0][1]] = 1;

        // switch
        this.ones.push(posZeroToOne[0]);
        this.zeroes.push(posOneToZero[0]);
    }

    isRectAtPos(i, j) {
        let sum = 0;
        sum = this.arr[i][j] + this.arr[i+1][j] + this.arr[i][j+1] + this.arr[i+1][j+1];
        return sum == 4;
    }

    detectRects() {
        let newRects = [];
        for (let i = 0; i < (this.nRows - 1); i++) {
            for (let j = 0; j < (this.nCols - 1); j++) {
                if (this.isRectAtPos(i, j)) {
                    newRects.push([i, j]);
                }
            }
        }
        return newRects;
    }

    hasNewRect() {
        let newRects = this.detectRects()
        console.log("These are DETECTED RECTS!!!!");
        console.log(newRects);

        // compare both lists
        for (let i = 0; i < newRects.length; i++) {
            let pairFound = false;
            for (let j = 0; j < this.rects.length; j++) {
                if (newRects[i][0] == this.rects[j][0] && newRects[i][1] == this.rects[j][1]) {
                    pairFound = true;
                }
            }
            if (!pairFound) {
                this.rects = newRects;
                return true
            }
        }
        this.rects = newRects;
        return false;
    }

    consolePrint() {
        let s = "chichi";
        for (let i = 0; i < this.nRows; i++) {
            s = s + "\n";
            for (let j = 0; j < this.nCols; j++) {
                s = s + " " + this.arr[i][j].toString();
            }
        }
        console.log("Grid status: ")
        console.log(s);
    }
}


class Display {
    constructor(canvas, bgColor="black", fgColor="white") {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.bgcolor = bgColor;
        this.fgcolor = fgColor;
        this.initialize();
    }

    initialize() {
        this.drawBackground();
    }

    drawBackground() {
        this.ctx.fillStyle = this.bgcolor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawScene(grid) {
        this.drawBackground();
        let dx = this.canvas.width / (grid.nCols + 1);
        let dy = this.canvas.height / (grid.nRows + 1);

        for (let i = 0; i < grid.nCols; i++) {
            for (let j = 0; j < grid.nRows; j++) {
                if (grid.arr[j][i]) {
                    let posX = (i + 1) * dx;
                    let posY = (j + 1) * dy;

                    this.drawPoint(posX, posY);
                }
            }
        }
    }

    drawPoint(posX, posY) {
        this.ctx.fillStyle = this.fgcolor;
        this.ctx.fillRect(posX, posY, 4, 4);
        this.ctx.fill();
    }

   printResults(resString) {
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.font = "bold 18px Arial";
        this.ctx.fillText(resString, 30, 30);
   }
}


class Results {

    constructor() {
        this.resultsContainer = document.getElementById("results-container");
        this.resultsText = document.getElementById("results-text");
        this.n_generated_rects = 0;
        this.correct_registers = 0;
        this.incorrect_registers = 0;
        this.newRectFlag = false;
    }

    reload() {
        this.n_generated_rects = 0;
        this.correct_registers = 0;
        this.incorrect_registers = 0;
        this.newRectFlag = false;
    }

    draw() {
        console.log(this.toString());
        console.log("SHOWING TEH RESULTS!");
        this.resultsContainer.style.display = "block";
        this.resultsText.innerHTML = this.toString();
    }

    userRegister() {
        if (this.newRectFlag) {
            this.correct_registers++;
        } else {
            this.incorrect_registers++;
        }
    }

    newRectRegister() {
        this.n_generated_rects++;
        this.newRectFlag = true;
    }

    noNewRectRegister() {
        this.newRectFlag = false;
    }

    toString() {
        let s = "Results: <br>";
        s = s + "Number of generated rectangles: " + this.n_generated_rects + "<br>";
        s = s + "\nCorrect hits: " + this.correct_registers + "<br>";
        s = s + "\nIncorrect hits: " + this.incorrect_registers + "<br>";
        s = s + "\nMissed rectangles: " + (this.n_generated_rects - this.correct_registers) + "<br>";
        return s;
    }
}


class Game {

    constructor(canvas, nRows, nCols, period = PERIOD_MS, timeLimit = DEFAULT_TIME_LIMIT) {
         this.grid = new Grid(nRows, nCols);
         this.display = new Display(canvas);
         this.controls = new Controls();
         this.timer = new Timer(timeLimit, period);
         this.results = new Results();

         this.fireInterval = undefined;
         this.period = period;
         this.running = false;
    }

    startGame() {
        this.running = true;
        this.controls.setStateRunning();
        this.results.reload();
        this.fireInterval = setInterval(this.gameStep, this.period, this.display,
            this.grid, this.timer, this.controls, this.results);
    }

    stopGame() {
        this.running = false;
        // controls dont need to be enabled because now the pop up will lead you to paradise
        //this.controls.setStateIdle();
        this.controls.writeTimeString(this.timer.timeLimit / 1000);
        clearInterval(this.fireInterval);
        this.results.draw();
        //this.display.printResults(this.results.toString());
    }

    gameStep(display, grid, timer, controls, results) {
        grid.step();
        timer.step();
        controls.writeTimeString(timer.secondsToGo());

        if (grid.hasNewRect()) {
            console.log("WE HAVE A NEW RECT HERE BOIS!!!!!!!!!!!!!!!!");
            results.newRectRegister();
        } else {
            results.noNewRectRegister();
        }
        display.drawScene(grid);

        if (timer.timeout()) {
            startStopBtnCb();
        }
    }

}

class Controls {

    constructor() {
        this.timeSelect = document.getElementById("timeSelect");
        this.timeInfo = document.getElementById("timeInfo");
        this.startStopBtn = document.getElementById("startStopBtn");
        this.registerBtn = document.getElementById("registerBtn");
        this.startStopBtnRunState = "STOP";
        this.startStopBtnIdleState = "START";
        this.setStateIdle();
    }

    setStateRunning() {
        this.timeSelect.disabled = true;
        this.registerBtn.disabled = false;
        this.startStopBtn.textContent = this.startStopBtnRunState;
    }

    setStateIdle() {
        this.timeSelect.disabled = false;
        this.registerBtn.disabled = true;
        this.startStopBtn.textContent = this.startStopBtnIdleState;
    }

    writeTimeString(nSeconds) {
        let secs = nSeconds % 60;
        let mins = Math.floor(nSeconds / 60);

        this.timeInfo.innerHTML = this.padNumToStr(mins) + ":" + this.padNumToStr(secs);
    }

    padNumToStr(num) {
        if (num < 10){
            return "0" + num.toString();
        }
        return num.toString();
    }
}


class Timer {

    constructor(timeLimit, timeStep) {
        this.timeLimit = timeLimit * 1000;
        this.timeStep = timeStep;
        this.elapsedTIme = 0;
    }

    reload() {
        this.elapsedTIme = 0;
    }

    setTimeLimit(nSeconds) {
        this.timeLimit = nSeconds * 1000;
        this.reload();
    }

    secondsToGo() {
        return (this.timeLimit - this.elapsedTIme) / 1000;
    }

    step() {
        this.elapsedTIme = this.elapsedTIme + this.timeStep;
    }

    timeout() {
        return this.elapsedTIme >= this.timeLimit;
    }
}


function startStopBtnCb() {
    if (!game.running) {
        game.startGame();
    } else {
        game.stopGame();
    }
}

function registerBtnCb() {
    game.results.userRegister();
    console.log("User register activated");
}

function timeSelectCb(selObj) {
    let val = selObj.value;
    let val2set = 60;
    switch(val) {
        case "1":
            val2set = 60;
            break;
        case "5":
            val2set = 5 * 60;
            break;
        case "10":
            val2set = 10 * 60;
            break;
        case "20":
            val2set = 20 * 60;
            break;
        default:
            val2set = 60;
    }
    console.log("CHOSEN TIME " + val + " / " + val2set);
    game.controls.writeTimeString(val2set);
    game.timer.setTimeLimit(val2set);
}

canvas = document.getElementById("myCanvas");
const game = new Game(canvas, 6, 12);