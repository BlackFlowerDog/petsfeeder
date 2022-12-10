function deleteTime(time){
	if(CURRENT_NAME != undefined){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/settings/schedule?action=delete_time&pet_name=${CURRENT_NAME}&time=${time}`, false);
		xhr.send();
		if (xhr.status != 200) {
			alert(xhr.status + ': ' + xhr.statusText); 
		} 
		updateSchedule();
	} else {
		alert("Please, add pet.");
	}
}

function changeActivate(){
	if(CURRENT_NAME != undefined){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/settings/schedule?action=change_activation&pet_name=${CURRENT_NAME}`, false);
		xhr.send();
		if (xhr.status != 200) {
			alert(xhr.status + ': ' + xhr.statusText); 
		}
		updateSchedule();
	} else {
		alert("Please, add pet.");
	}
}

function validateHhMm(inputField){
	var isValid = /([0-1][0-9]|2[0-3]):([0-5][0-9])?$/.test(inputField.value);

    if (isValid) {
      inputField.style.backgroundColor = '#bfa';
    } else {
      inputField.style.backgroundColor = '#fba';
    }
    return isValid;
}

function addTime(){
	if(CURRENT_NAME != undefined){
		var xhr = new XMLHttpRequest();
		var time = document.getElementById("new-time");
		if(validateHhMm(time)){
			xhr.open('GET', `/settings/schedule?action=add_time&pet_name=${CURRENT_NAME}&time=${time.value}`, false);
			xhr.send();
			if (xhr.status != 200) {
				alert(xhr.status + ': ' + xhr.statusText); 
			} 
			updateSchedule();
		} else {
			alert("Format is not correct. Input must be look like HH:MM.");
		}
	} else {
		alert("Please, add pet.");
	}
}

function resetSchedule(){
	if(CURRENT_NAME != undefined){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/settings/schedule?action=reset_schedule&pet_name=${CURRENT_NAME}`, false);
		xhr.send();
		if (xhr.status != 200) {
			alert(xhr.status + ': ' + xhr.statusText); 
		}
		updateSchedule();
	} else {
		alert("Please, add pet.");
	}
}

function updateSchedule(){
	fetch(`/api/get_schedule/${CURRENT_NAME}`)
		.then((d) => {
			return d.json();
		})
		.then((d) => {	
			if (d != '0'){
				let scheduleIsActivate = document.querySelectorAll('.schedule-activate');
				let schedule = document.querySelectorAll('.schedule');
				let scheduleInfo = document.querySelectorAll('.schedule-info'); 
				let scheduleTable = document.querySelectorAll('.schedule-table');
				
				if(d.activate){
					scheduleIsActivate[CURRENT_PET].innerHTML = "Schedule is used";
					schedule[CURRENT_PET].setAttribute('data-tooltip', "");
					schedule[CURRENT_PET].setAttribute('data-tooltip', getStrwithTime(d.time));
					if(d.time.length != 0){
						scheduleInfo[CURRENT_PET].innerHTML = "This is your used feeding schedule.";
						scheduleTable[CURRENT_PET].innerHTML = "";
						scheduleTable[CURRENT_PET].innerHTML += '<tr> <th> № </th> <th> Time </th></tr>';
						d.time.forEach((e, j) => {
							scheduleTable[CURRENT_PET].innerHTML += '<tr> <td>' + (j + 1) + '</td>  <td>' + e + '</td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" onclick="deleteTime('+ '\'' + e +'\'' +')" height="30" width="30""></td> </tr>';
						});
					} else{
						scheduleInfo[CURRENT_PET].innerHTML = "The schedule usage feature is activated. Please set the feeding time.";
						drawScheduleTemplate(scheduleTable[CURRENT_PET]);
					}
				} else {
					scheduleIsActivate[CURRENT_PET].innerHTML = "Schedule is not used";
					schedule[CURRENT_PET].setAttribute('data-tooltip', "");
					if(d.time.length != 0){
						scheduleInfo[CURRENT_PET].innerHTML = "The schedule usage feature is not activated. There is no saved schedule on server. Activate the schedule usage feature and set the feeding time to start feeding your pet according to the schedule.";
						scheduleTable[CURRENT_PET].innerHTML = "";
						scheduleTable[CURRENT_PET].innerHTML += '<tr> <th> № </th> <th> Time </th></tr>';
						d.time.forEach((e, j) => {
							scheduleTable[CURRENT_PET].innerHTML += '<tr> <td>' + (j + 1) + '</td>  <td>' + e + '</td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" onclick="deleteTime('+ '\'' + e +'\'' +')" height="30" width="30""></td> </tr>';
						});
					} else{
						scheduleInfo[CURRENT_PET].innerHTML = "The schedule usage feature is not activated. The saved feeding schedule is not used. To start please activate the schedule usage feature.";
						drawScheduleTemplate(scheduleTable[CURRENT_PET]);
					}
				}
			} 	
		})	
}