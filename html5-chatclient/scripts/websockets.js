var ourUsername = "none";
var subscription = null;
var conn = null;
var users = [];

$(function() {
   conn = hookbox.connect('http://km.hosted.hookbox.org');
   conn.onOpen = function() { console.log("connection established!"); }
   conn.onError = function(err) { alert("connection failed: " + err.msg); }

   conn.subscribe("my_events"); 
	conn.onSubscribed = function(channelName, _subscription) {
		ourUsername = conn.username;
		console.log("subscribed and got username " + ourUsername);
		subscription = _subscription;

	 	users = subscription.presence;
	 	updateUserList();

	 	subscription.onPublish = function(frame) {
	 		if (frame.user != ourUsername) {
	 			console.log(frame.user + " said: " + frame.payload);
	 			html5team4.webdb.addPost(JSON.parse(frame.payload));
	 		}
	 	}

		subscription.onSubscribe = function(frame) {
			console.log(frame.user + " connected");
			addUserUnlessExists(frame.user);
		}

		subscription.onUnsubscribe = function(frame) {
			console.log(frame.user + " disconnected");
			removeUser(frame.user);
		}

	}

});

function publishPost(post) {
	console.log("skal publishe %o ", post);
	try {
		conn.publish("my_events", JSON.stringify(post));
	} catch (e) {
		console.log(e);
	}
}

function updateUserList() {
	console.debug("update %s users", users.length)
	var container = $('#online_users');
	container.empty();
	$.each(users, function(index, user) { 
		console.debug("adding %s to online users", user)
		container.append(user + "<br />");
	});
}

function addUserUnlessExists(username) {
	var addUser = true;
	$.each(users, function(index, user) { 
		if(username == user) {
			addUser = false;
			return;
		}
	});

	if (addUser == true) {
		users.push(username);
	}
	updateUserList();
}

function removeUser(username) {
	var toRemove = -1;
	$.each(users, function(index, user) { 
	if(username == user) {
		toRemove = index;
	}
	});

	if(toRemove != -1) {
		removeUserByIndex(toRemove);
	}
}

function removeUserByIndex(index) {
	users.splice(index, 1)
	updateUserList();
}
