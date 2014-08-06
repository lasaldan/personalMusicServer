/**
 *	Includes all Controllers related to Playlists
 */

var app = angular.module('RadioDan');

	app.controller("PlaylistController", [
		'$scope', '$http', 'playlistService', 
		function($scope, $http, playlistService) {
	
		$scope.playlists = [];
		$scope.showAddForm = false;
		$scope.newPlaylistName = "";

		
		// load initial dataset from server via service
		sync();
		
		
		function sync() {
		
			playlistService.getPlaylists().then(
				function( playlists ) {

					applyRemoteData( playlists );

				}
			);
			
		};
		
		function applyRemoteData( playlists ) {

			$scope.playlists = playlists;

		};
				
				
		$scope.addPlaylist = function() {
		
			playlistService.addPlaylist( $scope.newPlaylistName ).then(
				sync, 
				function( error ) {
				
					console.warn( error );
					
				}
			);
			
			$scope.newPlaylist.title = "";
			$scope.showAddForm = false;
			
		};
		
		
		$scope.removePlaylist = function( id ) {
		
			playlistService.removePlaylist( id ).then(
				sync, 
				function( error ) {
				
					console.warn( error );
					
				}
			);
			
			$scope.$emit("playlistRemoved", id)
			
		}
		
		$scope.updatePlaylist = function( name, id ) {
		
			playlistService.getPlaylistById( id ).then(
				function( response ) {
					
					response['name'] = name;
					delete response['_id'];
					
					playlistService.updatePlaylist( id , response ).then (
						sync
					);
					
				},
				function( error ) {
				
					console.warn( error );
					
				}
			);
			
			$scope.$emit("playlistNameChange", {id:id, name:name})
		
		}
		
		$scope.requestPlaylistChange = function( id ) {
		
			$scope.$emit( "requestPlaylistChange", id );
			
		};
		
	}]);
	
	app.controller("CurrentPlaylistController", [
		'$scope', '$http', 'playlistService',
		function($scope, $http, playlistService) {
		
		$scope.tracks = [];
		$scope.playlistName = "Sample";
		
		$scope.addTrackForm = false;
		$scope.addingTracks = false;
		$scope.allowRemove = true;
		$scope.uploadingTracks = false;
		
		$scope.$on( "changePlaylistName", function( event, data ) {
		
			$scope.playlistName = data.name;
			
		});
		
		
		$scope.$on( "changePlaylist", update );
		
		
		$scope.uploadTracks = function() {
		
			$scope.addTrackForm = false;
			$scope.uploadingTracks = true;
			
		}
		
		
		$scope.selectTracks = function() {
		
			$scope.addingTracks = true;
			$scope.addTrackForm = false;
			
		}
		
		
		$scope.hideOverlay = function() {
		
			$scope.addingTracks = false;
			$scope.uploadingTracks = false;
			
		}
		
		$scope.playTrack = function( id ) {

			$scope.$emit( "playStart", id );
			
		}
		
		
		function update( event, id ) {

			$call = playlistService.getTracksFromPlaylist;
			$scope.addTrackForm = false;
			
			$call( id ).then(
				function( response ) {

					$scope.tracks = response;
					
				},
				function( error ) {
				
					console.warn( error );
					
				}
			);
			
			if( id == null ) {
			
				$scope.playlistName = "All Tracks";
				$scope.allowRemove = false;
			} 
			else 
			{
			
				$scope.allowRemove = true;
				
				playlistService.getPlaylistById( id ).then(
					function( response ) {
					
						$scope.playlistName = response.name;
						
					},
					function( error ) {
					
						console.warn( error );
						
					}
				);
			}
		};
		
		// Load and display initial data from webservice
		update();
		
	}]);