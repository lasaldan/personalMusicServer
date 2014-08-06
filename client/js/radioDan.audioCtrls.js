/**
 *	Includes all Controllers related to Tracks
 */

var app = angular.module('RadioDan');

app.controller("AudioController", [
	'$scope', '$timeout', 'trackService', 'playlistService',
	function($scope, $timeout, trackService, playlistService) {
	
	$scope.audioElement;
	$scope.playing = false;
	$scope.audioEl;
	$scope.progressBar = document.getElementById('progressBar');
	
	$scope.track = {
		title: "No Track Loaded",
		artists: ["-- N/A --"],
		notes: ""
	};
	
	$scope.$on( "trackBegin", function( event, id ) {
		
		trackService.getTrackById( id ).then(
			function( response ) {
			
				$scope.playing = false;
				
				$scope.track = response;
				src = "http://lasaldan.com/radio/music/" + $scope.track.filename;
				$scope.audioEl = document.getElementById('audioPlayer');
				$scope.audioEl.src = src;
				
				$scope.play();
				
			},
			function( error ) {
			
			}
		);
		
	});
	
	$scope.play = function() {
	
		$scope.playing = true;
		$scope.audioEl.play();
		$scope.updateProgressBar();
	}
	
	$scope.pause = function() {
		
		$scope.playing = false;
		$scope.audioEl.pause();
		
	}
	
	$scope.updateProgressBar = function() {
	
		percentPlayed = $scope.audioEl.currentTime / $scope.audioEl.duration * 100;
		
		$scope.progressBar.style.width = percentPlayed+"%";

		$timeout($scope.updateProgressBar, 500);
        
    };
	
}]);
