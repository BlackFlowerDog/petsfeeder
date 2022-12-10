function fillBowl() {
	alert("The bowl is filled with food");
}
function updateData() {
	fetch("/api/get_pet_food_level")
		.then((d) => {
			return d.json();
		})
		.then((d) => {	
			if(CURRENT_NAME in d) {
				let leftClock = document.getElementById('meter-left');
				let rangeClock = document.getElementById('meter-pointer');
				rangeClock.style.transform = 'rotate(' + (-90 + ((d[CURRENT_NAME] * 180)/100)) + 'deg)';
				if (d[CURRENT_NAME] <= 33) {
					leftClock.style.stroke = "#d91e1e"; 
				} else {
					leftClock.style.stroke = "#de6868";
				}
				foodlevel.innerHTML = d[CURRENT_NAME] + '%';
				setTimeout(updateData, 1000);
			} else {
				levelfood.innerHTML = "no data";
			}
		})
}

updateData();