var CURRENT_PET = 0;
var CURRENT_NAME = "";

function changeCurrentPetPlus(){
	let petCards = document.querySelectorAll('.card-wrapper');
	let petNames = document.querySelectorAll('.name');
	let scheduleEditor = document.querySelectorAll('.schedule-table-wrapper');
	petCards[CURRENT_PET].style.display = 'none';
	if(scheduleEditor[CURRENT_PET] != undefined){
		scheduleEditor[CURRENT_PET].style.display = 'none';
	}
	CURRENT_PET++;
	if(CURRENT_PET == petCards.length){
		CURRENT_PET = 0;
	}
	CURRENT_NAME = petNames[CURRENT_PET].innerHTML;
	petCards[CURRENT_PET].style.display = '';
	if(scheduleEditor[CURRENT_PET] != undefined){
		scheduleEditor[CURRENT_PET].style.display = '';
	}
}
function changeCurrentPetMinus(){
	let petCards = document.querySelectorAll('.card-wrapper');
	let petNames = document.querySelectorAll('.name');
	let scheduleEditor = document.querySelectorAll('.schedule-table-wrapper');
	petCards[CURRENT_PET].style.display = 'none';
	if(scheduleEditor[CURRENT_PET] != undefined){
		scheduleEditor[CURRENT_PET].style.display = 'none';
	}
	CURRENT_PET--;
	if(CURRENT_PET < 0){
		CURRENT_PET = petCards.length - 1;
	}
	CURRENT_NAME = petNames[CURRENT_PET].innerHTML;
	petCards[CURRENT_PET].style.display = '';
	if(scheduleEditor[CURRENT_PET] != undefined){
		scheduleEditor[CURRENT_PET].style.display = '';
	}
}

function drawPetCardContainers(num){
	let wrapper = document.getElementById("cards-wrapper");
	wrapper.innerHTML = "";
	for(i = 0; i < num; i++){
		wrapper.innerHTML += `<div class="card-wrapper" display="">
			<div class="card">
			<div class="card-info-wrapper">
			<img class="card-icon" src="" align="right" height="50" width="50">
			<div class="card-info">	
			<p class="name"></p>
			<p class="type"></p>
			<p class="sex"></p>
			<p class="birthday"></p>
			<p class="age"></p>
			<p class="schedule-activate"></p>
			<p class="schedule" data-tooltip=""><img src="https://cdn.onlinewebfonts.com/svg/download_393076.png" align="right" height="50" width="50"></p>
			</div>
			</div>
			</div>
			<div class="pet-photo-wrapper"><img class="pet-photo" src=""></div>
			</div>`;
	}
}

function getStrwithTime(timeArray){
	let timeStringWithHTMLtag = " ";
	for(let i = 0; i < timeArray.length; i++){
		timeStringWithHTMLtag += timeArray[i] + ' ';
	}
	return timeStringWithHTMLtag;
}

function drawPetCards() {
	fetch("/api/get_pets")
		.then((d) => {
			return d.json();
		})
		.then((d) => {	
			let keyNames = Object.keys(d);
			drawPetCardContainers(keyNames.length);  
			let cardIcons = document.querySelectorAll('.card-icon');
			let petNames = document.querySelectorAll('.name');
			let petTypes = document.querySelectorAll('.type');
			let petSex = document.querySelectorAll('.sex');
			let petBirthdays = document.querySelectorAll('.birthday');
			let petAges = document.querySelectorAll('.age');
			let scheduleIsActivate = document.querySelectorAll('.schedule-activate');
			let schedule = document.querySelectorAll('.schedule');
			let petPhotos = document.querySelectorAll('.pet-photo');
			let pathPhoto = "/static/images/";
			let petCards = document.querySelectorAll('.card-wrapper');

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
				if(d[keyNames[i]].sex) {
					petSex[i].innerHTML = "male";
				} else {
					petSex[i].innerHTML = "female";
				}
				petBirthdays[i].innerHTML = d[keyNames[i]].birthday;
				if(d[keyNames[i]].birthday){
					petAges[i].innerHTML = countAge(d[keyNames[i]].birthday);
				}
				if(d[keyNames[i]].schedule.activate) {
					scheduleIsActivate[i].innerHTML = "Schedule is used";
					schedule[i].setAttribute('data-tooltip', "");
					if(d[keyNames[i]].schedule.time.length != 0){
						schedule[i].setAttribute('data-tooltip', getStrwithTime(d[keyNames[i]].schedule.time));
					} else {
						schedule[i].setAttribute('data-tooltip', "No data");
					}
				} else {
					scheduleIsActivate[i].innerHTML = "Schedule is not used";
					schedule[i].setAttribute('data-tooltip', "");
					schedule[i].setAttribute('data-tooltip', "No data");
				}
				petPhotos[i].setAttribute('src', pathPhoto + d[keyNames[i]].photoName);

				if (i > 0){
					petCards[i].style.display = "none";
				}
			}

			if(keyNames.length == 0) {
				drawCardTemplate();
			}
			if(document.location.pathname == "/settings/addpets"){
				drawDeletePetButton();
			}
			
		})
}

function drawCardTemplate(){
	drawPetCardContainers(1);
	document.querySelector('.name').innerHTML = "Pet name";
	document.querySelector('.type').innerHTML = "cat/dog";
	document.querySelector('.card-icon').setAttribute('src', "https://images.squarespace-cdn.com/content/v1/5d8750e6111bdc1bcfc37cc3/1581071706146-QPNGCGZEU47ZY3RNSJG6/Logo.png");
	document.querySelector('.sex').innerHTML = "male/female";
	document.querySelector('.birthday').innerHTML = "xxxx.xx.xx";
	document.querySelector('.age').innerHTML = "xx years xx month";
	document.querySelector('.schedule').setAttribute('data-tooltip', "");
	document.querySelector('.schedule').setAttribute('data-tooltip', "times for feed");
	document.querySelector('.pet-photo').setAttribute('src', "https://ae03.alicdn.com/kf/H7e829ee3f6244a07aef8ca3830a31dffN.jpg");
}

function countAge(birthdayStr){
	let now = new Date();
	let birthday = new Date(birthdayStr);
	let msAge = now - birthday;
	let years = Math.trunc(msAge / (1000 * 60 * 60 * 24 * 30 * 12));
	let months = Math.trunc(msAge / (1000 * 60 * 60 * 24 * 30) % 12);
	return years + ' years ' + months + ' months';
}


if(document.location.pathname != "/settings/schedule"){
	drawPetCards();
}
