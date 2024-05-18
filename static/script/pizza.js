import { Tridi } from "./tridi/tridi.js";

const startStopBtn = document.getElementById("startStopBtn").addEventListener("click", startStopBtnCb)
const timeSelect = document.getElementById("timeSelect").addEventListener("change", timeSelectCb)

const container = document.getElementById("scene-container");
const tridi = new Tridi(container);

function startStopBtnCb() {
    console.log("THE CB IS CALLED")
    if (!tridi.loop.running) {
        tridi.start();
    } else {
        tridi.stop();
    }
}

function timeSelectCb() {
    let val = tridi.controls.timeSelect.value;
    let val2set;

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
    tridi.controls.timer.setTimeLimit(val2set);
    tridi.controls.writeTimeString(val2set);
}

//todo - make this better
document.onkeydown = function (e) {
    let str = "";
    switch (e.code) {
        case "ArrowLeft":
            str = 'Left';
            console.log(str);
            tridi.pizza.moveLeft();
            break;
        case "ArrowUp":
            str = 'Up';
            console.log(str);
            tridi.pizza.moveUp();
            break;
        case "ArrowRight":
            str = 'Right';
            console.log(str);
            tridi.pizza.moveRight();
            break;
        case "ArrowDown":
            str = 'Down';
            console.log(str);
            tridi.pizza.moveDown();
            break;
        case "KeyA":
            console.log("KeyA vole");
            tridi.pizza.tiltLeft();
            break
        case "KeyS":
            console.log("KeyS vole");
            tridi.pizza.tiltRight();
            break;
    }
}