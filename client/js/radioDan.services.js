/**
 *	Includes all Services
 */

var app = angular.module('RadioDan');


/**
 *	Service for managing communication with webservice regarding Tracks
 */
app.service('trackService', function( $http ) {

	return ({
		getAllTracks:   getAllTracks,
		getTrackById:   getTrackById
	});
	
	function getAllTracks() {
		var request = $http({
			method: "GET",
			url: "http://lasaldan.com:3000/radio/api/tracks",
		});
		
		return request.then( success, fail );
	}
	
	function getTrackById( id ) {
	
		var request = $http({
			method: "GET",
			url: "http://lasaldan.com:3000/radio/api/tracks/" + id,
		});
		
		return request.then( success, fail );
	}
	
	
	function success( response ) {

		return response.data;
		
	}
	
	
	
	function fail( response ) {
	
		console.warn("Error from Track Service");
		
	}
	
	
});


/**
 *	Service for managing communication with webservice regarding Playlists
 */
app.service('playlistService', function( $http ){

	// Specify which methods should be available through this service
	return ({
		getPlaylists:          getPlaylists,
		getPlaylistById:       getPlaylistById,
		getTracksFromPlaylist: getTracksFromPlaylist,
		addPlaylist:           addPlaylist,
		removePlaylist:        removePlaylist,
		updatePlaylist:        updatePlaylist
	});
	
	
	
	function getPlaylists() {
	
		var request = $http({
			method: "GET",
			url: "http://lasaldan.com:3000/radio/api/playlists",
		});
		
		return request.then( success, fail );
	};
	
	
	
	function getPlaylistById( id ) {
	
		var request = $http({
			method: "GET",
			url: "http://lasaldan.com:3000/radio/api/playlists/"+id,
		});
		
		return request.then( success, fail );
	};
	
	function getTracksFromPlaylist( id ) {
	
		var request = $http({
			method: "GET",
			url: "http://lasaldan.com:3000/radio/api/playlists/tracks/"+id,
		});
		
		return request.then( success, fail );
	};
	
	
	
	function addPlaylist( name ) {
	
		payload = {
			"name": name, 
			"tracks": []
		};
		
		var request = $http({
			method: 'POST',
			url: 'http://lasaldan.com:3000/radio/api/playlists',
			data: payload,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		return request.then( success, fail );
	};
	
	
	
	function removePlaylist( id ) {
	
		var request = $http({
			method: 'DELETE',
			url: 'http://lasaldan.com:3000/radio/api/playlists/'+id
		});
		
		return request.then( success, fail );
	};
	
	
	
	function updatePlaylist( id, data ) {
	
		var request = $http({
			method: 'PUT',
			url: 'http://lasaldan.com:3000/radio/api/playlists/'+id,
			data: data,
			headers: {
				'Content-Type': 'application/json'
			}
		})
		
		return request.then( success, fail );
	};
	
	
	
	function success( response ) {

		return response.data;
		
	}
	
	
	
	function fail( response ) {
		console.log(response);
		console.warn("Error from Playlist Service");
		
	}
	
	
});