$(document).ready(function(){

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

	// bind rover to 5
     $('#rover').poopRating(5, 5);
     // here we are listening for when rover takes a dump because we are responsible owners
     $('#rover').on('pooped', function (event, value) {
        console.log(value);
         alert('Your dog pooped ' + value + ' times....');
     });

     //  Made the comonent so that you can initialize using either direct id selector or by css class
     $('.scruffy-and-family').poopRating(5, 3);

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