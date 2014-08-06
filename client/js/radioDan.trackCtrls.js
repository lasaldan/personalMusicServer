/**
 *	Includes all Controllers related to Tracks
 */

var app = angular.module('RadioDan');

app.controller("TrackController", [
	'$scope', 'trackService', 'playlistService',
	function($scope, trackService, playlistService) {
	
	$scope.tracks = [];
	$scope.currentList = [];
	$scope.currentPlaylist = null;
	
	
	$scope.save = function() {
		
		playlistService.getPlaylistById( $scope.currentPlaylist ).then(
			function( response ) {
			
				var tracks = [];
				
				for(i in $scope.currentList)
					if( $scope.currentList[i] )
						tracks.push(i);
				
				response['tracks'] = tracks;
				
				delete response['_id'];
				
				playlistService.updatePlaylist( $scope.currentPlaylist , response ).then (
					function() {
						sync();
						
						$scope.$emit( "currentPlaylistModified", $scope.currentPlaylist );
					}
				);
			},
			function( error ) {
			
				console.warn( error );
				
			}
		);
	}
	
	function sync() {
	
		$call = trackService.getAllTracks;
		
		$call().then(
			function( response ) {
			
				$scope.tracks = response;
				
			},
			function( error ) {
			
				console.warn( error );
				
			}
		);			
		
	};
	
	$scope.$on("currentPlaylist", function( event, id ) {
		
		if( ! (typeof(id) == 'undefined') ) {
		
			playlistService.getPlaylistById( id ).then(
				function( response ) {
				
					temp = {};
					
					for(t in response.tracks)
						temp[response.tracks[t]] = true;
					
					$scope.currentPlaylist = id;
					$scope.currentList = temp;
					
				},
				function( error ) {
				
					console.warn( error ); 
					
				}
			);
		}
	});
	
	// Load and display initial data from webservice
	sync();
	
}]);

app.controller("TrackUploadController", [
	'$scope', 'trackService', 'playlistService',
	function($scope, trackService, playlistService) {
	

}]);
