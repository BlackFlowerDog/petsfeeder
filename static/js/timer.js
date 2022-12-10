function timerStart(times){
    let timeUntil;
    for(let i = 0; i < times.length; i++){
        let hourMin = times[i].split(":");
        let dateNow = new Date();
        let dateFeed = new Date();
        dateFeed.setHours(hourMin[0], hourMin[1], 0);
        timeUntil = dateFeed - dateNow;
        if (timeUntil > 0){            
            break;
        } 
        if(i == (times.length - 1)){
            hourMin = times[0].split(":");
            dateFeed.setDate(dateFeed.getDate() + 1);
            dateFeed.setHours(hourMin[0], hourMin[1], 0);
            timeUntil = dateFeed - dateNow;
        }
    }
    return getTimerStr(timeUntil);
}

function getTimerStr(ms){
    let hours = Math.trunc(ms/3600000);
    let minutes = Math.trunc((ms%3600000)/60000);
    let seconds = Math.trunc(((ms%3600000)%60000)/1000);
    let timerStr = "";
    if(hours < 10){
        timerStr += "0";
    } 
    timerStr += hours + ":";
    if(minutes < 10) {
        timerStr += "0";
    }
    timerStr += minutes + ":";
    if(seconds < 10){
        timerStr += "0";
    }
    timerStr += seconds;
    return timerStr;
}

function timer() {
	fetch(`/api/get_schedule`)
		.then((d) => {
			return d.json();
		})
		.then((d) => {
            let timerTag = document.getElementById("timer-data");
            if(d != '0'){
                if(d[CURRENT_NAME].activate && d[CURRENT_NAME].time.length != 0){
                    let times = d[CURRENT_NAME].time;
                    console.log(times);
                    timerTag.innerHTML = timerStart(times);
                } else {
                    timerTag.innerHTML = "00:00:00";
                }
                setTimeout(timer, 1000);
            } else {
                timerTag.innerHTML = "00:00:00";
            }
            
		})
}

timer();
