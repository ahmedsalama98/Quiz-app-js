var count = document.querySelector(".quiz-head .count span"),
    countdowndiv = document.querySelector(".count-down"),
    head = document.querySelector(".quiz-head"),
    queleng = document.querySelector(".resuelt .total"),
    resualt = document.querySelector(".resuelt"),
    finalresualt = document.querySelector(".final-resuelt"),
    currentques = document.querySelector(".resuelt .answer"),
    bulletscontainer = document.querySelector(".bullets"),
    answersarea = document.querySelector(".answers-area"),
    submitbutt = document.querySelector(".submit-butt"),
    currentindex = 0,
    rightanswer = 0,
    wronganswer = 0,
    countdowninterval;


function getquestion() {

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if (this.readyState === 4 && this.status === 200) {
            let questionsobject = JSON.parse(this.responseText);
            let questioncount = questionsobject.length;


            bullets(questioncount);
            addquestioncontent(questionsobject[currentindex], questioncount);
            handllebullents();

            countdown(90, questioncount)

            submitbutt.onclick = () => {
                let therightanswer = questionsobject[currentindex]["right-answer"];
                checkanswer(therightanswer, questioncount);
                currentindex++;
                answersarea.innerHTML = "";
                addquestioncontent(questionsobject[currentindex], questioncount);
                handllebullents();
                result(questioncount);
                clearInterval(countdowninterval);
                countdown(180, questioncount)

            }
        }
    }
    request.open("GET", "questionas.json", true);
    request.send()
}
getquestion()

function bullets(num) {
    count.innerHTML = num;
    queleng.innerHTML = num;


    for (let i = 0; i < num; i++) {
        let span = document.createElement("span");
        if (i === 0) {
            span.classList.add("active");
        }
        bulletscontainer.append(span);
    }

};

function handllebullents(bull) {
    let bullets = Array.from(document.querySelectorAll(".bullets span"))
    bullets.forEach((span, index) => {
        if (index == currentindex) {
            span.classList.add("active");
            currentques.innerHTML = index + 1;
        }

    })
}

function addquestioncontent(obj, count) {
    if (currentindex < count) {
        let header = document.createElement("h2");
        header.textContent = obj.title;

        answersarea.append(header)
        for (var x = 1; x <= 4; x++) {

            let answer = document.createElement("div");
            let radiobutt = document.createElement("input");
            let label = document.createElement("label");

            answer.classList.add("answer");
            answersarea.append(answer)

            radiobutt.type = "radio";
            radiobutt.name = "answer";
            radiobutt.id = `answer-${x}`;
            radiobutt.dataset.answer = obj[`answer${x}`];
            if (x === 1) {
                radiobutt.checked = true;
            }
            answer.append(radiobutt);


            label.textContent = obj[`answer${x}`];
            label.htmlFor = `answer-${x}`;
            answer.append(label)

        }
    }

};

function checkanswer(ranswer, count) {

    let radia = document.getElementsByName("answer");
    let thechosen;

    for (var t = 0; t < radia.length; t++) {
        if (radia[t].checked === true) {
            thechosen = radia[t].dataset.answer;

        }
    }
    console.log(thechosen)
    if (thechosen == ranswer) {
        rightanswer++;
        console.log(rightanswer)
    } else {
        wronganswer++;


    }
}

function result(count) {
    let score;

    if (count === currentindex) {
        answersarea.remove();
        bulletscontainer.remove();
        submitbutt.remove();
        resualt.remove();
        head.remove()

        if (rightanswer <= 5) {
            score = ` <span class="bad"> bad </span> ${rightanswer} from ${count} `
        }
        if (rightanswer >= 6) {
            score = `<span class="good"> good </span> ${rightanswer} from ${count} `
        }
        if (rightanswer === count) {
            score = `<span class="perfect"> perfect </span> ${rightanswer} from ${count} `
        }

        finalresualt.innerHTML = score;
        finalresualt.style.display = "block"
    }

}

function countdown(duration, count) {


    let min, sec;

    countdowninterval = setInterval(function() {

        min = Math.floor(parseInt(duration / 60));
        sec = parseInt(duration % 60);

        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        countdowndiv.innerHTML = `${min}:${sec}`

        duration--;

        if (duration < 0) {
            clearInterval(countdowninterval);
            submitbutt.click()
        }
    }, 1000)

}