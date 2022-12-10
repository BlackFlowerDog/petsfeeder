const pc = document.getElementById('new-time');

pc.addEventListener('input', e => {
	const v = e.target.value;
	pc.value = v.length ? v.replace(/:/g, '').match(/.{1,2}/g).join(':') : '';
});

function drawScheduleTemplate(table) {
	table.innerHTML = '';
	table.innerHTML += '<tr> <td> № </td> <td> Time </td> <td></td></tr>';
	table.innerHTML += '<tr> <td> 1 </td> <td> xx : xx </td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" height="30" width="30"> </td></tr>';
	table.innerHTML += '<tr> <td> 2 </td> <td> xx : xx </td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" height="30" width="30"> </td></tr>';
	table.innerHTML += '<tr> <td> 3 </td> <td> xx : xx </td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" height="30" width="30"> </td></tr>';
}

function drawScheduleEditorContainers(num){
	let wrapper = document.getElementById("schedule-tables-wrapper");
	wrapper.innerHTML = "";
	for(i = 0; i < num; i++){
		wrapper.innerHTML += `<div class="schedule-table-wrapper" >
			<p class="schedule-info"></p>
			<div class="schedule-table-container"><table class="schedule-table"></table></div>
			<p><input type="checkbox" class="checkbox" name="isSchedule" onclick="changeActivate()"> Use schedule </p>
			</div>`;
	}
}

function drawPetCardsAndScheduleEditor() {
	fetch("/api/get_pets")
		.then((d) => {
			return d.json();
		})
		.then((d) => {	
			let keyNames = Object.keys(d);

			drawPetCardContainers(keyNames.length);  
			drawScheduleEditorContainers(keyNames.length);
			if(keyNames.length == 0){
				drawScheduleEditorContainers(1);
			}
				
			let cardIcons = document.querySelectorAll('.card-icon');
			let petNames = document.querySelectorAll('.name');
			let petTypes = document.querySelectorAll('.type');
			let petSex = document.querySelectorAll('.sex');
			let petBirthdays = document.querySelectorAll('.birthday');
			let petAges = document.querySelectorAll('.age');
			let scheduleIsActivate = document.querySelectorAll('.schedule-activate');
			let schedule = document.querySelectorAll('.schedule');
			let petPhotos = document.querySelectorAll('.pet-photo');
			let petCards = document.querySelectorAll('.card-wrapper');
			let pathPhoto = "/static/images/";

			let scheduleInfo = document.querySelectorAll('.schedule-info'); 
			let scheduleEditor = document.querySelectorAll('.schedule-table-wrapper'); 
			let checkboxes = document.querySelectorAll('.checkbox');
			let scheduleTable = document.querySelectorAll('.schedule-table');

			if(keyNames.length != 0){
				CURRENT_NAME = keyNames[0];
			}
			
			for (let i = 0; i < keyNames.length; i++) {
				petNames[i].innerHTML = keyNames[i];
				if(d[keyNames[i]].type){
					petTypes[i].innerHTML = "cat";
					cardIcons[i].setAttribute('src', "https://pngroyale.com/wp-content/uploads/2021/11/cartoon-cat-png-1202495-1.png");
				} else {
					petTypes[i].innerHTML = "dog";
					cardIcons[i].setAttribute('src', "https://www.clipartmax.com/png/full/94-941923_there-is-a-side-view-of-a-dog-shape-with-a-short.png");					
				}
				if(d[keyNames[i]].sex){
					petSex[i].innerHTML = "male";
				} else {
					petSex[i].innerHTML = "female";
				}
				petBirthdays[i].innerHTML = d[keyNames[i]].birthday;
				if(d[keyNames[i]].birthday){
					petAges[i].innerHTML = countAge(d[keyNames[i]].birthday);
				}
				checkboxes[i].checked = d[keyNames[i]].schedule.activate;
				if(d[keyNames[i]].schedule.activate){
					scheduleIsActivate[i].innerHTML = "Schedule is used";
					if(d[keyNames[i]].schedule.time.length != 0){
						scheduleInfo[i].innerHTML = "This is your used feeding schedule.";
					} else {
						scheduleInfo[i].innerHTML = "The schedule usage feature is activated. Please set the feeding time.";
					}
				} else {
					scheduleIsActivate[i].innerHTML = "Schedule is not used";
					if(d[keyNames[i]].schedule.time.length == 0) {
						scheduleInfo[i].innerHTML = "The schedule usage feature is not activated. There is no saved schedule on server. Activate the schedule usage feature and set the feeding time to start feeding your pet according to the schedule.";
					} else {
						scheduleInfo[i].innerHTML = "The schedule usage feature is not activated. The saved feeding schedule is not used. To start please activate the schedule usage feature.";
					}
				}
				schedule[i].setAttribute('data-tooltip', "");
				if (d[keyNames[i]].schedule.time.length != 0){
					schedule[i].setAttribute('data-tooltip', getStrwithTime(d[keyNames[i]].schedule.time));
					scheduleTable[i].innerHTML = '';
					scheduleTable[i].innerHTML += '<tr> <td> № </td> <td> Time </td> <td></td></tr>';
					for(let j = 0; j < d[keyNames[i]].schedule.time.length; j++){
						let e = d[keyNames[i]].schedule.time[j];
						scheduleTable[i].innerHTML += '<tr> <td>' + (j + 1) + '</td>  <td>' + e + '</td> <td><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1200px-Flat_cross_icon.svg.png" onclick="deleteTime('+ '\'' + e +'\'' +')" height="30" width="30""></td> </tr>';
					}
				} else {
					schedule[i].setAttribute('data-tooltip', "No data");
					drawScheduleTemplate(scheduleTable[i]);
				}
				
				petPhotos[i].setAttribute('src', pathPhoto + d[keyNames[i]].photoName);

				if (i > 0){
					petCards[i].style.display = "none";
                    scheduleEditor[i].style.display = "none";
            	}
			}
			if(keyNames.length == 0) {
				drawCardTemplate(); 
				drawScheduleTemplate(scheduleTable[0]);
			}
		})
}

if(document.location.pathname == "/settings/schedule"){
	drawPetCardsAndScheduleEditor();
}