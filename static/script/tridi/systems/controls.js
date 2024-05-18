
class Controls {

    constructor(timer) {
        this.timer = timer;
        this.timeSelect = document.getElementById("timeSelect");
        this.timeInfo = document.getElementById("timeInfo");
        this.startStopBtn = document.getElementById("startStopBtn");
        this.startStopBtnRunState = "STOP";
        this.startStopBtnIdleState = "START";
        this.setStateIdle();
    }

    setStateRunning() {
        this.timer.start();
        this.timeSelect.disabled = true;
        this.startStopBtn.textContent = this.startStopBtnRunState;
    }

    setStateIdle() {
        this.timer.stop();
        this.writeTimeString(this.timer.timeLimit);
        this.timeSelect.disabled = false;
        this.startStopBtn.textContent = this.startStopBtnIdleState;
    }

    tick() {
        this.writeTimeString(this.timer.secondsRemaining());
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

class Results {
    constructor(meshObject) {
        this.meshObject = meshObject;
        this.canvas = document.getElementById("myChart");
        this.canvas.hidden = true;
        this.nSamples = 0;
        this.xx = []
        this.xvals = [];
        this.zvals = [];
        this.rotvals = [];
        this.firstTime = true;
        this.reload();
    }

    tick() {
        this.nSamples++;
        if (!(this.nSamples % 10)) {
            this.xx.push(" ");
            //this.xx.push(Math.round(this.nSamples / 60));
            this.xvals.push(this.meshObject.worldPos('x') / 1.5);
            this.zvals.push(this.meshObject.worldPos('z') / 1.5);
            this.rotvals.push(this.meshObject.rotZ / (Math.PI / 3));
        }
    }

    reload() {
        this.nSamples = 0;
        this.xx = [];
        this.xvals = [];
        this.zvals = [];
        this.rotvals = [];
        this.canvas.style.display = "none";
    }

    drawGraphFirstTime() {
        this.chart = new Chart("myChart", {
                                type: "line",
                                data: {
                                    labels: this.xx,
                                    datasets: [
                                        {
                                        label: "UP/DOWN DEVIATIONS",
                                        data: movingAvg(this.zvals, 20),
                                        borderColor: "red",
                                        fill: false
                                        },
                                        {
                                        label: "LEFT/RIGHT DEVIATIONS",
                                        data: movingAvg(this.xvals, 20),
                                        borderColor: "blue",
                                        fill: false
                                        },
                                        {
                                        label: "LEFT/RIGHT TILT",
                                        data: movingAvg(this.rotvals, 20),
                                        borderColor: "green",
                                        fill: false
                                        }
                                    ]
                                },
                                options: {
                                        scales: {
                                          yAxes: {
                                            display: true,
                                            ticks: {
                                              //beginAtZero: true,
                                              min: -1,
                                              steps: 21,
                                              stepValue: 0.1,
                                              max: 1
                                            }
                                          },
                                          xAxes: {
                                            display: false,
                                            ticks: {
                                              display: false
                                            }
                                          }
                                        },
                                }
        });
        this.firstTime = false;
        console.log("chart should be visible");
    }

    drawGraph() {
        this.canvas.style.display = "initial";
        if (this.firstTime) {
            this.drawGraphFirstTime();
        } else {
            this.chart.data.labels = this.xx;
            this.chart.data.datasets[0].data = movingAvg(this.zvals, 20);
            this.chart.data.datasets[1].data = movingAvg(this.xvals, 20);
            this.chart.data.datasets[2].data = movingAvg(this.rotvals, 20);
            this.chart.update();
        }
    }
}

function movingAvg(array, count){

    // calculate average for subarray
    var avg = function(array){

        var sum = 0, count = 0, val;
        for (var i in array){
            val = array[i];
            sum += val;
            count++;
        }

        return sum / count;
    };

    var result = [], val;

    // pad beginning of result with null values
    for (var i=0; i < count-1; i++)
        result.push(null);

    // calculate average for each subarray and add to result
    for (var i=0, len=array.length - count; i <= len; i++){

        val = avg(array.slice(i, i + count));
        if (isNaN(val))
            result.push(null);
        else
            result.push(val);
    }

    return result;
}

export { Controls, Results }