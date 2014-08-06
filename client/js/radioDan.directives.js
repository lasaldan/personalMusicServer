/**
 *	Includes all Services
 */

var app = angular.module('RadioDan');

	app.directive('ngConfirmClick', [
		function(){
		
			return {
			
				link: function (scope, element, attr) {
				
					var msg = attr.ngConfirmClick || "Are you sure?";
					var clickAction = attr.confirmedClick;
					
					element.bind('click',function (event) {
					
						if ( window.confirm(msg) ) {
						
							scope.$eval(clickAction);
						}
					});
				}
			};
		}
	]);
	
	app.directive('stopEvent', function () {
	
		return {
		
			restrict: 'A',
			link: function (scope, element, attr) {
			
				element.bind('click', function (e) {
				
					e.stopPropagation();
					
				});
			}
		};
	});
	
	app.directive('audioPlayer', function () {
	
		return {
		
			restrict: 'A',
			link: function (scope, element, attr) {
			
				setSrc = function( src ) {
				
					element.src = src;
				
				}
			}
		};
	});