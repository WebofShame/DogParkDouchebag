$(document).ready(function(){

	//the modal itself, fired by the button in the right end of navbar
	$('.modal').modal();


	$('.timepicker').pickatime({
	default: 'now', // Set default time: 'now', '1:30AM', '16:30'
	fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
	twelvehour: false, // Use AM/PM or 24-hour format
	donetext: 'OK', // text for done-button
	cleartext: 'Clear', // text for clear-button
	canceltext: 'Cancel', // Text for cancel-button
	autoclose: false, // automatic close timepicker
	ampmclickable: true, // make AM PM clickable
	aftershow: function(){} //Function for after opening timepicker
	});

	//adds already randomized Elizibethan insult to small card on right side
	//**DOESNT NOT WORK IN LOCAL DEV ENVIRONMENT on Chrome, b/c of chrome settings
	//works in Safari, should work when server-to-server.
	function insultor() {
		var queryURL = 'http://quandyfactory.com/insult/json';

		$.ajax({
			url: queryURL,
			method: "GET",


		})
		.done(function(response) {
			var randomInsult = response.insult;
			$("#submission-insult").html(randomInsult);
		})
	}

////Dave's auto date/time picker 
     $(function(){
		$('input[type="time"][value="now"]').each(function(){
			var d = new Date();
			h = d.getHours();
			m = d.getMinutes();
			if(h < 10) h = '0' + h;
			if(m < 10) m = '0' + m;
			$(this).attr({
				'value': h + ':' + m
			});
		});
  	});

	$(function(){
		$('input[type="text"][value="day"]').each(function(){
			var today = new Date();
			var month = today.getMonth();
			var date = today.getDate();
			var year = today.getFullYear();
			$(this).attr({
				"value": month + "/" + date + "/" + year
			});
		});
	});



});