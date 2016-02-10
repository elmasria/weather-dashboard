function getDataBase(){
	if(localStorage.getItem(configurations.dataBaseName)) {
		dataBase = JSON.parse(localStorage.getItem(configurations.dataBaseName));
	}else{
		var db = {"cities":[
		{city: 'London', country:'GB', _id: 2643743}, 
		{city: 'Grenoble', country:'FR', _id: 6454071},
		{city: 'New York', country:'US', _id: 5128581},
		{city:'Beirut', country: 'LB', _id:276781}
		]};
		localStorage.setItem(configurations.dataBaseName, JSON.stringify(db));
		dataBase = JSON.parse(localStorage.getItem(configurations.dataBaseName));
	}
}


function getLocation() {
	return new Promise(function (resolve, reject){
		var currentLocation = {};
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function showPosition(position) {
				currentLocation.currentPositionLatitude =  position.coords.latitude;
				currentLocation.currentPositionLongitude = position.coords.longitude;	
				resolve(currentLocation);
			}, function showError(error) {
					switch(error.code) {
						case error.PERMISSION_DENIED:
						currentLocation.error=  "User denied the request for Geolocation."
						reject(currentLocation);
						break;
						case error.POSITION_UNAVAILABLE:
						currentLocation.error= "Location information is unavailable."
						reject(currentLocation);
						break;
						case error.TIMEOUT:
						reject(currentLocation);
						currentLocation.error= "The request to get user location timed out."
						reject(currentLocation);
						break;
						case error.UNKNOWN_ERROR:
						currentLocation.error= "An unknown error occurred."
						reject(currentLocation);
						break;
					}
				});    

		} else { 
			reject("Geolocation is not supported by this browser.");
		}
	});
}

