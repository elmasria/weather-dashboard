angular.module('WeatherDashboard').controller('EditWeatherController', function($http,$filter){

	var controller = this;
	getDataBase();
	controller.cities = dataBase.cities;
	controller.showAlert = false;
	controller.ShowExtraOptions = false;
	controller.showLoading = false;

	

	// below function help to remove a location from DB
	controller.removeLocation = function(event, locationID){
		event.preventDefault();
		// get the target location
		var CityTarget = $filter('filter')(dataBase.cities, locationID , true);
		// get the index of the location in the database
		var index =dataBase.cities.indexOf(CityTarget[0]);
		//remove the location from the database array
		dataBase.cities.splice(index, 1);
		// update database
		localStorage.setItem(configurations.dataBaseName, JSON.stringify(dataBase));
	};

	// below function help to add new location
	controller.addNewLocation = function(event, item){
		event.preventDefault();
		// convert location info to an array
		var cityInfo = controller.extraCities.split(",");
		// check if city exist
		var CityExist = $filter('filter')(dataBase.cities, +cityInfo[1] , true);
		if(CityExist.length === 0){
			// New Location
			var location = {};
			location.country = cityInfo[2];
			location.city = cityInfo[0];
			location._id= cityInfo[1];
			// add location to database array
			dataBase.cities.push(location);
			//update database
			localStorage.setItem(configurations.dataBaseName, JSON.stringify(dataBase));

			// Display message for the user
			controller.warning = false;
			controller.success = true;
			controller.alertMessageStrong = 'Well done! ';
			controller.alertMessage = 'You successfully Added a City';
			controller.showAlert = true;
			// hide options
			controller.ShowExtraOptions = false;
			// clear input text
			controller.city = "";
		}else{		
			// Location exist 
			// display a message for the user		
			controller.warning = true;
			controller.success = false;
			controller.alertMessageStrong = 'Warning! ';
			controller.alertMessage = 'City Already Exist';
			controller.showAlert = true;
		}
	}
	
	// below function help user to check the available cities
	controller.CheckCountry = function(event){
		event.preventDefault();
		controller.showLoading = true;
		// get list of locations
		$http.get('javascript/app-data/city.list.json')
		.then(function(response) {	
			// check if user input match a city in the cities list		
			var CityFromResponse = $filter('filter')(response.data, controller.city );
			if(CityFromResponse.length > 0){
				// match location 
				// show options 
				// clear old selected options
				controller.showAlert = false;
				controller.showLoading = false;			
				controller.extraCities = null;
				controller.matchedCities = CityFromResponse;	
				controller.ShowExtraOptions = true;	
			}else{
				// input doesn't match any city
				// stop loading				
				controller.showLoading = false;
				// display message for user
				controller.success = false;
				controller.warning = true;
				controller.alertMessageStrong = 'Warning!';
				controller.alertMessage = 'Please enter a valid City';
				controller.showAlert = true;	
				controller.ShowExtraOptions = false;	
			}			
		});
	};	

});