var app = function () {
	// local for self/this scoping
	var self = this,
		// html from our handbars template which is passed to create the template function
		doucheBagHtml = $('#douchebag-card-template').html();

	// will hold a reference to our initialized firebase database instsance
	this.fireDb = undefined;
	// good ol' window reference for internal ease
	this.window = $(window);
	// Just a reference to main content div
	this.mainContent = $('#card-space');
	// holds our Handlebars function returned by comiling our card template.  This function can be called over and over passing an object which will be filled in using the compiled template.
	this.doucheBagTemplate = Handlebars.compile(doucheBagHtml);

	// indicator whether our initial firebase call has completed or not
	this.initialLoadComplete = false;
	// holds whether we are buffering on scroll to prevent duplicate calls
	this.isCallBuffered = false;

	// Initialize Firebase
	this.fireBaseConfig = {
		apiKey: "AIzaSyDeSO3Sqx-F-m3a7bvoVBYW39UL6th9eDU",
		authDomain: "dogpark-douchebags.firebaseapp.com",
		databaseURL: "https://dogpark-douchebags.firebaseio.com",
		projectId: "dogpark-douchebags",
		storageBucket: "dogpark-douchebags.appspot.com",
		messagingSenderId: "392493477164"
	};

	// utility function to get a guid
	this.getGuid = function () {
		var s4 = function () {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};

		// returns random s4 results as Guid ex. 00000000-0000-0000-0000-000000000000
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	this.initControls = function () {
		// initialize modal dialog
		$('.modal').modal();

		// Add our parallax header
		$('.parallax').parallax();

		// initialize pickatime instances
		$('.timepicker').pickatime({
			default: 'now', // Set default time: 'now', '1:30AM', '16:30'
			fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
			twelvehour: false, // Use AM/PM or 24-hour format
			donetext: 'OK', // text for done-button
			cleartext: 'Clear', // text for clear-button
			canceltext: 'Cancel', // Text for cancel-button
			autoclose: false, // automatic close timepicker
			ampmclickable: true, // make AM PM clickable
			aftershow: function () {} //Function for after opening timepicker
		});

		////Dave's auto date/time picker
		$('input[type="time"][value="now"]').each(function () {
			var d = new Date();
			h = d.getHours();
			m = d.getMinutes();
			if (h < 10) h = '0' + h;
			if (m < 10) m = '0' + m;
			$(this).attr({
				'value': h + ':' + m
			});
		});

		$('input[type="text"][value="day"]').each(function () {
			var today = new Date();
			var month = today.getMonth();
			var date = today.getDate();
			var year = today.getFullYear();
			$(this).attr({
				"value": month + "/" + date + "/" + year
			});
		});
	}

	// reverses our snapshots and then calls on each iteration passing this as object, our key, and the current item
	this.reverseSnapshotEntries = function (snap, callback) {
		var keys = [];
		// loop our keys and push to array
		for (var val in snap) {
			keys.push(val);
		}
		// now we have our keys lets loop and call passing our this context, firebase key and firebase item
		for (var i = keys.length - 1; i >= 0; i--) {
			// use call
			callback.call(snap, keys[i], snap[keys[i]]);
		}
	};

	// utility function to get the count of unique keys
	this.keyCount = function (snap) {
		var keys = [];
		// loop our keys and push to array
		for (var val in snap) {
			keys.push(val);
		}
		// return the length of keys found
		return keys.length;
	};

	// random number generator..  dont't leave home without it..
	this.getRandomInt = function (min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	};

	// adds a card to the container
	this.addPoopCard = function (key, item, prepend) {
		// feed the curent item into our Handlebars doucheBagTemplate which will render the row data against our item and template. Wrapped in jquery selector in order to get a jquery object.
		var renderedDoucheBag = $(self.doucheBagTemplate(item));
		// attach our key to the rendered jQuery card object
		renderedDoucheBag.data('key', key);

		// initialize the poop rating
		renderedDoucheBag.find('.poop-rater').poopRating(5, self.getRandomInt(1, 5));

		// handle prepend/append and render to main content
		if (prepend) {
			self.mainContent.prepend(renderedDoucheBag);
		} else {
			self.mainContent.append(renderedDoucheBag);
		}
	};

	this.initFireBase = function () {
		firebase.initializeApp(this.fireBaseConfig);

		// var provider = new firebase.auth.GithubAuthProvider();

		// firebase.auth().signInWithPopup(provider).then(function (result) {
		// 	// This gives you a GitHub Access Token. You can use it to access the GitHub API.
		// 	var token = result.credential.accessToken;
		// 	// The signed-in user info.
		// 	var user = result.user;

		// 	console.log(user);
		// 	// ...
		// }).catch(function (error) {
		// 	console.log(error);
		// 	// Handle Errors here.
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	// The email of the user's account used.
		// 	var email = error.email;
		// 	// The firebase.auth.AuthCredential type that was used.
		// 	var credential = error.credential;
		// 	// ...
		// });

		// get instance of firebase and assign
		this.fireDb = firebase.database();

		// show our loading indicator
		$('#loading').show();

		// call once on the last 5 entries to initially load the 5 most recent entries
		this.fireDb.ref().orderByKey().limitToLast(5).once('value', function (snapshot) {

			// call our reverseSnapshotEntries function in order to iterate in reverse through the returned entries
			self.reverseSnapshotEntries(snapshot.val(), function (key, item) {
				// add the card
				self.addPoopCard(key, item);
			});

			// flag that we are initialized
			self.initialLoadComplete = true;

			// hide our loading indicator
			$('#loading').hide();

			// the page starts with class full on loading to make it initially larger.  Since the initial load is complete we do not need it this big hence remove the full class to unapply
			$('#loading').removeClass('full');

			// go ahead and show our main content since we have our initial data set
			$('#main-content').show();
		});

		self.fireDb.ref().on('child_added', function (item) {
			// check to see if initial load is complete as we do not want to add anything until after we have done our initial load.
			if (self.initialLoadComplete) {
				//console.log('adding', item.key, item.val());
				// add the card
				self.addPoopCard(item.key, item.val(), true);
			}
		});
	};

	this.initEvents = function () {

		// attach our submit form
		$('#subButt').on('click', function () {
			event.preventDefault();
			self.submitForm()
		});

		// window.scroll is called every time scrolling takes place on the page
		this.window.scroll(function () {
			// Get the dif against the window adding 5 for good measure
			if ($(document).height() - self.window.height() <= self.window.scrollTop() + 5) {
				// check to see if we are currently buffering data and waiting for a response to prevent unnecessary calls to firebase if we are within the scroll bottom margin
				if (!self.isCallBuffered) {
					// since this is a new call set our buffer variable to prevent additional calls while we are still waiting for a response
					self.isCallBuffered = true;

					// show our loading content indicator
					$('#loading').show();

					// snag the last poop-card key from the data element so we know where we left off
					var lastKnownKey = $('#main-content .poop-card').last().data('key');

					// make a single once call to firebase asking for the last 6 from our key.  Our page size is 5 so it will be a dupe of our last card + 5 new cards
					self.fireDb.ref().orderByKey().endAt(lastKnownKey).limitToLast(6).once('value', function (snapshot) {
						var records = snapshot.val();
						console.log(self.keyCount(records));
						if (self.keyCount(records) > 1) {
							// call our reverseSnapshotEntries function in order to iterate in reverse through the returned entries
							self.reverseSnapshotEntries(snapshot.val(), function (key, item) {
								// check to see whether the current key is equal to our last key and ignore if so
								if (lastKnownKey !== key) {
									// add the card
									self.addPoopCard(key, item);
								}
							});
						} else {
							$('#loading').hide();
						}

						// Set our buffer to false so we can load more if still scrolling
						self.isCallBuffered = false;

					});
				}
			}
		});
	};

	this.submitForm = function () {
		// check browser support for required functionality
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			alert('The File APIs are not fully supported in this browser.');
			return;
		}

		// get our file input element instance
		input = document.getElementById('submission-file');

		// do checks
		if (!input) {
			alert("Um, couldn't find the fileinput element.");
		} else if (!input.files) {
			alert("This browser doesn't seem to support the `files` property of file inputs.");
		} else if (!input.files[0]) {
			alert("Please select a file before clicking 'Load'");
		} else {
			// get the first input file in the selection array
			file = input.files[0];
			// initialize file reader API
			fr = new FileReader();
			// onload fire receivedText function to store image in firebase
			fr.onload = self.receivedText;
			// readDataAsURL reads the local file into a Base64 string
			fr.readAsDataURL(file);
		}
	};

	// return a promise from random insult api call
	this.getRandomInsult = function (categoryId, numQuestions) {
		var queryURL = 'http://quandyfactory.com/insult/json';

		return $.ajax({
			url: queryURL,
			headers: [
				{ 'Origin': 'https://www.eiko.com' }
			],
			method: "GET"
		});
	};

	this.receivedText = function () {
		//**************************STORE THE IMAGE IN FIREBASE***************************************
		// Create a root reference
		var storageRef = firebase.storage().ref();

		// call getGuid to get a unique Guid for storage
		var imgGuid = self.getGuid();

		// Create a reference to 'image'
		var imgRef = storageRef.child(imgGuid);

		// Create a reference to 'images/mountains.jpg'
		var imgPathRef = storageRef.child('images/' + imgGuid);

		// not sure what is going on here?
		// While the file names are the same, the references point to different files
		imgRef.name === imgPathRef.name // true
		imgRef.fullPath === imgPathRef.fullPath // false

		// display image
		var message = fr.result;

		$.when(
			// push our image to firebase storage
			imgPathRef.putString(message, 'data_url'),
			// call to get a random insult api
			self.getRandomInsult()
		).then(function (firebaseResult, randomInsultResult) {
			console.log(randomInsultResult);
			var snapshot = firebaseResult;
			//this is our url reference ?
			newImgSrc = snapshot.metadata.downloadURLs[0];
			// submit to firebase with
			doSubmission(newImgSrc);
			// newImg = $('<img>');
			// newImg.attr('src', newImgSrc);
			// $('#imageHolder').append(newImg);
		});
		// imgPathRef.putString(message, 'data_url').then(function (snapshot) {
		// 	console.log(snapshot);
		// 	// // this is our url reference?
		// 	newImgSrc = snapshot.metadata.downloadURLs[0];
		// 	// // submit to firebase with
		// 	doSubmission(newImgSrc);
		// 	// newImg = $('<img>');
		// 	// newImg.attr('src', newImgSrc);
		// 	// $('#imageHolder').append(newImg);
		// });

		function doSubmission(imgSrc, insult) {
			//store submission
			self.fireDb.ref().push({
				'submission-breed': $('#submission-breed').val(),
				'submission-location': $('#submission-location').val(),
				'submission-identifier': $('#submission-identifier').val(),
				'submission-title': $('#submission-title').val(),
				//'submission-by' : $('#submission-by').val(),
				//'submission-date-time' : $('#submission-date-time').val(),
				'submission-insult': insult,
				'submission-img': imgSrc,
				'submission-sortstamp': 0 - Date.now()
			})
		}
	};

	// fire off all of our init functions and get the part started
	this.initControls();
	this.initFireBase();
	this.initEvents();

}
$(document).ready(function () {
	//  As easy as new app()
	new app();
});
