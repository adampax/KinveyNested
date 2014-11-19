

var Kinvey = require('/lib/kinvey-titanium-1.1.8');

var win = Ti.UI.createWindow({
	backgroundColor : '#fff',
});

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
	left:70
});
win.add(offlineLabel);

offlineSwitch.addEventListener('change', function(e) {
	offlineLabel.text = offlineSwitch.value ? 'Online' : 'Offline';
});

var userStatus = Ti.UI.createLabel({
	top: 100,
	left: 20,
	text: 'No active user'
});
win.add(userStatus);

var populateBtn = Ti.UI.createButton({
	title: 'Populate Data',
	top:140
});
win.add(populateBtn);

populateBtn.addEventListener('click', function(){
	
});

var testBtn = Ti.UI.createButton({
	title: 'Test',
	top:180
});
win.add(testBtn);

testBtn.addEventListener('click', function(){
	
});

win.open();

var promise = Kinvey.init({
	appKey : APP_KEY,
	appSecret : APP_SECRET,
	sync : {
		enable : true,
		online : Titanium.Network.getOnline()// The initial application state.
	}
});
promise.then(function(activeUser) {
	console.log('activeUser ' + JSON.stringify(activeUser));
	userStatus.text = 'activeUser: ' + activeUser.username;

	if (!activeUser) {
		Kinvey.User.login({
			username : USER,
			password : PASS
		}, {
			success : function(res) {
				userStatus.text = 'activeUser: ' + res.username;
			},
			error: function(res){
				userStatus.text = 'User login error';
			}
		});
	}
});
