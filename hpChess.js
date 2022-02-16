var redTimerInterval;
var blueTimerInterval;

init();

function init() {
    addStyle();
    addMenu();
    addTimers();
    addListeners();
}

function addListeners() {
    config = {characterData: true, subtree: true};

    statusEl = document.getElementById("status");
    var statusMO = new MutationObserver(turnCallback);
    statusMO.observe(statusEl, config);

    cardEl = document.getElementsByClassName("word")[0];
    var cardMO = new MutationObserver(newGame);
    cardMO.observe(cardEl, config);
}

function turnCallback(mutations, observer) {
    for (mutation of mutations) {
        clearInterval(redTimerInterval);
        clearInterval(blueTimerInterval);
        switch (mutation.target.nodeValue) {
        case "red's turn":
            redTimerInterval = setInterval(redCountdown, 1000);
            break;
        case "blue's turn":
            blueTimerInterval = setInterval(blueCountdown, 1000);
            break;
        case "red wins!":
            blueTimer = document.getElementById("blueTimer");
            if(blueTimer.innerHTML == "0:00") {
                result = document.getElementById("status");
                result.innerHTML = "red wins by timeout.";
            }
            break;
        case "blue wins!":
            redTimer = document.getElementById("redTimer");
            if(redTimer.innerHTML == "0:00") {
                result = document.getElementById("status");
                result.innerHTML = "blue wins by timeout.";
            }
            break;
        }            
    }
}

function redCountdown(){
    redTimer = document.getElementById("redTimer");
    timeLeft = redTimer.innerHTML.split(":").map(parseFloat);
    timeLeft[1] -= 1;
    simplifyTime(timeLeft);
    redTimer.innerHTML = timeLeft[0] + ":" + (timeLeft[1] < 10 ? "0" : "") + timeLeft[1];
    if (redTimer.innerHTML == "0:00") {
        deadword = document.getElementsByClassName("black")[0];
        deadword.click();
    }
}

function blueCountdown(){
    blueTimer = document.getElementById("blueTimer");
    timeLeft = blueTimer.innerHTML.split(":").map(parseFloat);
    timeLeft[1] -= 1;
    simplifyTime(timeLeft);
    blueTimer.innerHTML = timeLeft[0] + ":" + (timeLeft[1] < 10 ? "0" : "") + timeLeft[1];
    if (blueTimer.innerHTML == "0:00") {
        deadword = document.getElementsByClassName("black")[0];
        deadword.click();
    }
}

function addStyle() {
    document.styleSheets[1].addRule(".blueText", "color : #4183cc");
    document.styleSheets[1].addRule(".redText", "color : rgb(209, 48, 48)");
    document.styleSheets[1].addRule(".grayText", "color : #888");
    document.styleSheets[1].addRule(".menuItem", "display : block");
}

function simplifyTime(timeArray) {
    if(timeArray[1] < 0) {
        timeArray[1] += 60;
        timeArray[0] -= 1;
        if(timeArray[0] < 0) {
            timeArray[0] = 0;
            timeArray[1] = 0;
        }
    }
    timeArray[0] += Math.floor(timeArray[1] / 60);
    timeArray[1] %= 60;   
}

async function newGame() {
    clearInterval(redTimerInterval);
    clearInterval(blueTimerInterval);
    addTimers();
    statusLine = document.getElementById("status-line");
    if (statusLine.className == "red-turn") {
        redTimerInterval = setInterval(redCountdown, 1000);
    } else{
        blueTimerInterval = setInterval(blueCountdown, 1000);
    }
}

function addTimers() {
    statusLine = document.getElementById("status-line");
    if (document.getElementById("redTimer") == null){
        redTimer = document.createElement("span");
        redTimer.classList.add("redText");
        redTimer.setAttribute("id", "redTimer");
    }
    if (document.getElementById("blueTimer") == null) {
        blueTimer = document.createElement("span");
        blueTimer.classList.add("blueText");
        blueTimer.setAttribute("id", "blueTimer");
    }

    redStart = [];
    redStart[0] = parseInt(menu.turnMin.value);
    redStart[1] = parseInt(menu.turnSec.value);
    blueStart = [];
    blueStart[0] = parseInt(menu.turnMin.value);
    blueStart[1] = parseInt(menu.turnSec.value);
    
    if (statusLine.className == "red-turn") {
        redStart[0] += parseInt(menu.bonusMin.value);
        redStart[1] += parseInt(menu.bonusSec.value);
        
        statusLine.insertBefore(redTimer, statusLine.children[1]);
        statusLine.insertBefore(blueTimer, statusLine.children[statusLine.children.length - 1]);
    } else {
        blueStart[0] += parseInt(menu.bonusMin.value);
        blueStart[1] += parseInt(menu.bonusSec.value);
        
        statusLine.insertBefore(blueTimer, statusLine.children[1]);
        statusLine.insertBefore(redTimer, statusLine.children[statusLine.children.length - 1]);
    }

    simplifyTime(redStart);
    simplifyTime(blueStart);
    redTimer.innerHTML = redStart[0] + ":" + (redStart[1] < 10 ? "0" : "") + redStart[1];
    blueTimer.innerHTML = blueStart[0] + ":" + (blueStart[1] < 10 ? "0" : "") + blueStart[1];
}

function addMenu() {
    gameView = document.getElementById("game-view");
    menu = document.createElement("form");    

    label = document.createElement("label");
    label.innerHTML = "time per team: ";
    label.classList.add("grayText", "menuItem");

    turnMin = document.createElement("select");
    turnMin.setAttribute("name", "turnMin");
    for (i = 0; i < 25; i++) {
        opt = document.createElement("option");
        opt.setAttribute("value", i);
        if (i == 3) {
            opt.selected = true;
        }
        opt.innerHTML = i;
        turnMin.appendChild(opt);
    }
    label.appendChild(turnMin);

    turnSec = document.createElement("select");
    turnSec.setAttribute("name", "turnSec");
    for (i = 0; i < 60; i++) {
        opt = document.createElement("option");
        opt.setAttribute("value", i);
        opt.innerHTML = (i < 10 ? "0" : "") + i;
        turnSec.appendChild(opt);
    }
    label.appendChild(turnSec);

    menu.appendChild(label);

    label = document.createElement("label");
    label.innerHTML = "first turn bonus: ";
    label.classList.add("grayText", "menuItem");

    bonusMin = document.createElement("select");
    bonusMin.setAttribute("name", "bonusMin");
    for (i = 0; i < 10; i++) {
        opt = document.createElement("option");
        opt.setAttribute("value", i);
        opt.innerHTML = i;
        bonusMin.appendChild(opt);
    }
    label.appendChild(bonusMin);

    bonusSec = document.createElement("select");
    bonusSec.setAttribute("name", "bonusSec");
    for (i = 0; i < 60; i++) {
        opt = document.createElement("option");
        opt.setAttribute("value", i);
        if (i == 30) {
            opt.selected = true;
        }
        opt.innerHTML = (i < 10 ? "0" : "") + i;
        bonusSec.appendChild(opt);
    }
    label.appendChild(bonusSec);

    menu.appendChild(label);

    gameView.prepend(menu);
}
