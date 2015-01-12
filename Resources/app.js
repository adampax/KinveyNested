/*
 * 1: Create a backend with the following collections:
 * 	'months'
 *  'seasons'
 *  'recipes'
 *
 * 2: Add app key, secret and user/pass to the constants below
 *
 * 3: launch app, click populate
 *
 * 4: Run tests in both online and offline modes
 *
 * 5: Check log for output
 */


const APP_KEY = '';
const APP_SECRET = '';
const USER = '';
const PASS = '';

var Kinvey = require('/lib/kinvey-titanium-1.1.9');
var Lib = require('/lib/lib');

var win = Ti.UI.createWindow({
	backgroundColor : '#fff'
});

/*
 * OFFLINE Switch
 */

var offlineSwitch = Ti.UI.createSwitch({
	top : 40,
	left : 10,
	value : Titanium.Network.getOnline(),
	titleOn : 'Offline',
	titleOff : 'Online'
});
win.add(offlineSwitch);

var offlineLabel = Ti.UI.createLabel({
	text : Titanium.Network.getOnline() ? 'Online' : 'Offline',
	top : 44,
	left : 70
});
win.add(offlineLabel);

offlineSwitch.addEventListener('change', function(e) {
	offlineLabel.text = offlineSwitch.value ? 'Online' : 'Offline';
});

/*
 * POPULATE DATA
 */

var populateBtn = Ti.UI.createButton({
	title : 'Populate Data',
	top : 40,
	right : 10
});
win.add(populateBtn);

populateBtn.addEventListener('click', function() {
	var months = Lib.parseJSON('/data/months.json');
	var seasons = Lib.parseJSON('/data/seasons.json');
	var meals = Lib.parseJSON('/data/meals.json');

	months.forEach(function(month) {
		Kinvey.DataStore.save('months', month, {
			success : function(res) {
				console.log('month added');
			},
			error : function(res) {
				console.log('save: ' + JSON.stringify(res));
			}
		});
	});

	seasons.forEach(function(season) {
		Kinvey.DataStore.save('seasons', season, {
			success : function(res) {
				console.log('sesaon added');
			},
			error : function(res) {
				console.log('save: ' + JSON.stringify(res));
			}
		});
	});

	meals.forEach(function(meal) {
		Kinvey.DataStore.save('meals', meal, {
			success : function(res) {
				console.log('meal added');
			},
			error : function(res) {
				console.log('save: ' + JSON.stringify(res));
			}
		});
	});
});

var userStatus = Ti.UI.createLabel({
	top : 80,
	left : 20,
	font : {
		fontSize : 14
	},
	text : 'activeUser: none'
});
win.add(userStatus);

/*
 * TEST 1  Month - Season
 */

var test1 = Ti.UI.createButton({
	title : 'Test 1: Month - Season',
	top : 120,
	left : 10
});
win.add(test1);

test1.addEventListener('click', function() {
	addResult('\nStarting test 1: ' + (offlineSwitch.value ? 'Online' : 'Offline') + '\n');

	var promise = Kinvey.DataStore.get('months', null, {
		offline : !offlineSwitch.value,
		relations : {
			//months : 'months',
			//'months.season' : 'seasons'
			season : 'seasons'

		},
		success : function(response) {
			response.forEach(function(month) {
				addResult(month.name + ' - ' + month.season.name);
				console.log(month.name + ' - ' + month.season.name);
				if (!month.season.name) {
					console.log(JSON.stringify(month));
				}
			});
		},
		error : function(res) {
			console.log('fetch error ' + JSON.stringify(res));
		}
	});
});

/*
 * TEST 2 Recipe - Months - Season
 */

var test2 = Ti.UI.createButton({
	title : 'Test 2: Meals - Months - Season',
	top : 150,
	left : 10
});
win.add(test2);

test2.addEventListener('click', function() {
	addResult('\nStarting Test 2: ' + (offlineSwitch.value ? 'Online' : 'Offline') + '\n');
	var promise = Kinvey.DataStore.get('meals', null, {
		offline : !offlineSwitch.value,
		relations : {
			months : 'months',
			'months.season' : 'seasons'

		},
		success : function(response) {
			addResult('# of Meals: ' + response.length);

			response.forEach(function(meal, idx) {

				addResult('\n'+(idx+1) + ': ' + meal.name);
				meal.months.forEach(function(month) {
					
				//check for empty object otherwise it blows up if not available
				month.season = month.season || {};

				addResult(month.name + ' - ' + month.season.name);

				console.log(month.name + ' - ' + month.season.name);
					if (!month.season) {
						console.log(JSON.stringify(month));
					}
				});
			});
		},
		error : function(res) {
			console.log('fetch error ' + JSON.stringify(res));
		}
	});
});

/*
 * TEST 3 Single Meal
 */

var test3 = Ti.UI.createButton({
	title : 'Test 3: Single Meal',
	top : 180,
	left : 10
});
win.add(test3);

test3.addEventListener('click', function() {
	var mealID = '546cf56705e2fe3112008e2e';
	addResult('\nStarting Test 3: ' + (offlineSwitch.value ? 'Online' : 'Offline') + '\n');
	var promise = Kinvey.DataStore.get('meals', mealID, {
		offline : !offlineSwitch.value,
		relations : {
			months : 'months',
			'months.season' : 'seasons'

		},
		success : function(meal) {
			addResult(meal.name);

			meal.months.forEach(function(month) {	
				//check for empty object otherwise it blows up if not available

				month.season = month.season || {};

				addResult(month.name + ' - ' + month.season.name);
				console.log(month.name + ' - ' + month.season.name);
				
				if (!month.season) {
					console.log(JSON.stringify(month));
				}
			});
		},
		error : function(res) {
			console.log('fetch error ' + JSON.stringify(res));
		}
	});
});

/*
 * CLEAR RESULTS
 */
var clearResults = Ti.UI.createButton({
	title: 'Clear',
	top:198,
	right:10
});
win.add(clearResults);

clearResults.addEventListener('click', function(){
	results.value = '';
});

/*
 * RESULTS TEXT AREA
 */

var results = Ti.UI.createTextArea({
	top : 220,
	bottom : 0,
	width : Ti.UI.FILL,
	backgroundColor : '#efefef',
	value : 'hello',
	font:{fontSize: 10}
});
win.add(results);

function addResult(text) {
	results.value += '\n' + text;
}

win.open();


/*
 * INIT KINVEY
 */

var promise = Kinvey.init({
	appKey : APP_KEY,
	appSecret : APP_SECRET,
	sync : {
		enable : true,
		online : Titanium.Network.getOnline()// The initial application state.
	}
});

promise.then(function(activeUser) {

	if (activeUser) {
		console.log('activeUser ' + JSON.stringify(activeUser));
		userStatus.text = 'activeUser: ' + activeUser.username;
	} else {
		console.log('doing login');

		Kinvey.User.logout({
			force : true
		});

		Kinvey.User.login({
			username : USER,
			password : PASS
		}, {
			success : function(res) {
				userStatus.text = 'activeUser: ' + res.username;
			},
			error : function(res) {
				userStatus.text = 'User login error';
				console.log('error: ' + JSON.stringify(res));
			}
		});
	}
});
