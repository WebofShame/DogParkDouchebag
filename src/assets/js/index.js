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

/*DAN'S STUFF*/

	var urlString;

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDeSO3Sqx-F-m3a7bvoVBYW39UL6th9eDU",
    authDomain: "dogpark-douchebags.firebaseapp.com",
    databaseURL: "https://dogpark-douchebags.firebaseio.com",
    projectId: "dogpark-douchebags",
    storageBucket: "dogpark-douchebags.appspot.com",
    messagingSenderId: "392493477164"
  };
  firebase.initializeApp(config);

  var database = firebase.database();


  database.ref().limitToFirst(10).orderByChild('submission-sortstamp').on("value", function(snapshot) {
    console.log('running...');
    console.log(snapshot.val());
    snapVal = snapshot.val()
    for (var property in snapVal) {
	    if (snapVal.hasOwnProperty(property)) {
	        thisKey = property;
			thisObject = snapVal[property];        
	        var newRow = $('<div class="row">');
	        var newCard = $('<div class="card large col s6 m8 hoverable">');
			var	newImgDiv = $('<div class="card-image"><img class="image-file" src="'+thisObject['submission-img']+'"><span class="card-title" id="submission-title"><span class="z-depth-5">'+thisObject['submission-title']+'</span></span></div>')
			var newAttrDiv = $('<div>Perp: <span id="submission-identifier">'+thisObject['submission-identifier']+'</span></div><div>Location: <span id="submission-location">'+thisObject['submission-location']+'</span></div><div>Breed: <span id="submission-breed">'+thisObject['submission-breed']+'</span></div>')
	        newCard.append(newImgDiv);
	        newCard.append(newAttrDiv);
	        newRow.append(newCard);
	        newRow = '<div class="row"><div class="card large col s6 m8 hoverable"><div class="card-image"><img id="image-file" src="'+thisObject['submission-img']+'"><span class="card-title"><span class="z-depth-5">'+thisObject['submission-title']+'</span></span></div><div class="card-content flow-text" id="card-content"><div>Perp: <span id="perp-identifier">'+thisObject['submission-identifier']+'</span></div><div>Location: <span>'+thisObject['submission-location']+'</span></div><div>Breed: <span>'+thisObject['submission-breed']+'</span></div></div></div><div class="container col s6 m4"><div class="card-panel brown hoverable" id="insult-card"><span class="white-text flow-text" id="submission-insult">this douche is such a douche</span></div></div></div>'
	        $('#main-content').append(newRow);


/*

<div class="row"><div class="card large col s6 m8 hoverable"><div class="card-image"><img id="image-file" src="assets/images/dogs1.jpg"><span class="card-title" id="submission-title"><span class="z-depth-5">Post Title</span></span></div><div class="card-content flow-text" id="card-content"><div>Perp: <span id="perp-identifier">Smelly Kelly</span></div><div>Location: <span id="submission-location">Leawood</span></div><div>Breed: <span id="submission-breed">Mongrel</span></div><div>Submitted by: <span id="submitted-by">Bob R.</span></div></div></div><div class="container col s6 m4"><div class="card-panel brown hoverable" id="insult-card"><span class="white-text flow-text" id="submission-insult">this douche is such a douche</span></div></div></div>

*/


	    }
	}
  })


 function formSubmission()
  {               
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   

    input = document.getElementById('submission-file');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");               
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsDataURL(file);
    }
  }
  

  function receivedText() {

    //**************************STORE THE IMAGE IN FIREBASE***************************************
  	// Create a root reference
  	var storageRef = firebase.storage().ref();
    var imgGuid = getGuid();
  	// Create a reference to 'image'
  	var imgRef = storageRef.child(imgGuid);

  	// Create a reference to 'images/mountains.jpg'
  	var imgPathRef = storageRef.child('images/' + imgGuid);

  	// While the file names are the same, the references point to different files
  	imgRef.name === imgPathRef.name            // true
  	imgRef.fullPath === imgPathRef.fullPath    // false

  	//display image
  	var message = fr.result;
  	imgPathRef.putString(message, 'data_url').then(function(snapshot) {
  	  newImgSrc = snapshot.metadata.downloadURLs[0];
      doSubmission(newImgSrc);
  	  newImg = $('<img>');
  	  newImg.attr('src',newImgSrc);
  	  $('#imageHolder').append(newImg);
  	});


    function doSubmission(imgSrc){
      //var timeStamp = firebase.database.ServerValue.TIMESTAMP;
      //store submission
      database.ref().push({
        'submission-breed' : $('#submission-breed').val(),
        'submission-location' : $('#submission-location').val(),
        'submission-identifier' : $('#submission-identifier').val(),
        'submission-title' : $('#submission-title').val(),
        //'submission-by' : $('#submission-by').val(),
        //'submission-date-time' : $('#submission-date-time').val(),
        'submission-img' :  imgSrc,
        'submission-sortstamp' : 0 - Date.now()
      })
    

      //console.log(JSON.stringify(userSubmission));

    }

  }   


 function getGuid(){
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
  

  $('#subButt').on('click',function(){
    event.preventDefault();
  formSubmission()});

});