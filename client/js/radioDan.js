(function() {

	var app = angular.module("RadioDan", ["xeditable"]);
	
	// Set theme for in-place-editing
	app.run(function(editableOptions) {
	
		editableOptions.theme = 'bs3'; 
		
	});
	

	/**
	 *	Main Controller for RadioDan - does broadcasting if emits make it this far
	 */	
	app.controller("PlayerController", ['$scope', function( $scope, $rootScope ) {
	
		$scope.currentPlaylist = 0;
		
		$scope.$on( "playStart", function( event, id ) {
		
			$scope.$broadcast( "trackBegin", id );
			
		});
		
		$scope.$on( "requestPlaylistChange", function( event, id ) {

			if( $scope.currentPlaylist != id ) {
			
				$scope.currentPlaylist = id;
				$scope.$broadcast( "changePlaylist", id );
				
				$scope.$broadcast( "currentPlaylist", $scope.currentPlaylist );
				
			}
			
		});
		
		$scope.$on( "playlistNameChange", function( event, data ) {

			if( $scope.currentPlaylist == data.id ) {
			
				$scope.$broadcast( "changePlaylistName", data );
				
			}
			
		});
		
		$scope.$on( "playlistRemoved", function( event, id ) {

			if( $scope.currentPlaylist == id ) {
			
				$scope.$broadcast( "changePlaylist" );
				
			}
			
		});
		
		$scope.$on( "requestCurrentPlaylist", function() {
			
			$scope.$broadcast( "currentPlaylist", $scope.currentPlaylist );
			
		});
		
		$scope.$on( "currentPlaylistModified", function( event, id ) {
			
			$scope.$broadcast( "changePlaylist", id );
			
		});
		
	}]);
	
})();