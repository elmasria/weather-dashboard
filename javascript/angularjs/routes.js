angular.module('WeatherDashboard').config(function ($routeProvider) {
	$routeProvider.when('/home',{
		templateUrl: '/templates/show.html'
	})	.when('/edit',{
		templateUrl: '/templates/settings.html'
	})
	.otherwise({redirectTo: '/home'});
});