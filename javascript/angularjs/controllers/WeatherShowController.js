angular.module('WeatherDashboard').controller('ShowWeatherController', function($http){
	//Define Variables
	var controller = this, 
	listofCities = [], 
	cities = [],	
	prefix = 'wi wi-',
	appid = '&appid=' + configurations.appid,
	unit = '&units=' + configurations.unit,
	siteURL = configurations.siteURL + 'group?id=';
	//show loading
	controller.showLoading = true;
	controller.showCurrentLocation = false;
	controller.noData = false;

	// check if browser support the Promise
	if(('Promise' in window)){
		getLocation().then(function(value){
			var currentURL =configurations.siteURL +'weather?lat='+value.currentPositionLatitude+
			'&lon=' + value.currentPositionLongitude + '&units=metric&appid=' + configurations.appid;
			$http.get(currentURL).then(function(response) {
				var result = response.data;
				controller.currentLocation = result.name;
				controller.currentTemperature = result.main.temp;
				controller.showCurrentLocation = true;
			});
		}).catch(function(error){
			controller.currentLocation = '';
			controller.currentTemperature = '';
			controller.showCurrentLocation = false;
		});
	}else{
		controller.currentLocation = '';
		controller.currentTemperature = '';
		controller.showCurrentLocation = false;
	}



	// Get Database from local-storage
	getDataBase();

	// Get all cities ID from local-storage
	for (var i=0, dbCities = dataBase.cities; i < dbCities.length; i++){
		listofCities.push(dbCities[i]._id);
	}

	if(listofCities.length > 0){
		// Build the request URL, using Cities ID
		var url = siteURL + listofCities.join(",") + unit + appid;

		// Send request to the weather API
		$http.get(url).then(function(response) {
			// Success
			for (var i=0; i < response.data.list.length; i++){			
				var city ={},
				code, 
				icon;		
				city.country = response.data.list[i].sys.country;
				city.name = response.data.list[i].name;
				city.temp = response.data.list[i].main.temp;			
				city.description = response.data.list[i].weather[0].description;				 
				code = response.data.list[i].weather[0].id;
				city._id =response.data.list[i].id; 
				city.latitude =response.data.list[i].coord.lat; 
				city.longitude =response.data.list[i].coord.lon; 
				city.date = new Date(response.data.list[i].dt * 1000); 
				city.humidity =response.data.list[i].main.humidity; //%
				city.pressure =response.data.list[i].main.pressure; // hPa
				city.temp_max =response.data.list[i].main.temp_max; 
				city.temp_min =response.data.list[i].main.temp_min; 
				city.main =response.data.list[i].weather[0].main; 
				city.windspeed =response.data.list[i].wind.speed; //meter/sec
				city.sunrise = new Date(response.data.list[i].sys.sunrise * 1000); 
				city.sunset = new Date(response.data.list[i].sys.sunset * 1000); 

				
				city.index = i;
				icon = weatherIcons[code].icon;

	  			// If we are not in the ranges mentioned above, add a day/night prefix.
	  			if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
	  				icon = 'day-' + icon;
	  			}

	  			// Finally tack on the prefix.
	  			icon = prefix + icon;
	  			city.icon = icon;
	  			cities.push(city);
	  		}
	  		
	  		// Send data to HTML page
	  		controller.cities = cities;
	  		// hide loading
			controller.showLoading = false; 
	  	});
	}else{
		controller.noData = true;
		controller.showLoading = false;
	}

	controller.moreDetail = function(event, index){
		event.preventDefault();
		var targetCity = controller.cities[index];
		controller.moreDetails = {};
		controller.moreDetails.name = targetCity.name;
		controller.moreDetails.id = targetCity._id;
		controller.moreDetails.country = targetCity.country;
		controller.moreDetails.longitude = targetCity.longitude;
		controller.moreDetails.latitude = targetCity.latitude;
		controller.moreDetails.date = targetCity.date;
		controller.moreDetails.humidity = targetCity.humidity;
		controller.moreDetails.pressure = targetCity.pressure;
		controller.moreDetails.temp_max = targetCity.temp_max;
		controller.moreDetails.temp_min = targetCity.temp_min;
		controller.moreDetails.main = targetCity.main;
		controller.moreDetails.sunrise = targetCity.sunrise;
		controller.moreDetails.sunset = targetCity.sunset;
		controller.moreDetails.description = targetCity.description;
		controller.moreDetails.temp = targetCity.temp;
		controller.moreDetails.icon = targetCity.icon;
	};

	controller.getMonth = function(month){
		var monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
		];
		var monthLetter = monthNames[month];
		return monthLetter;
	};
});