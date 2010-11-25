var ourUsername = "none";
var subscription = null;
var conn = null;

$(function() {
   conn = hookbox.connect('http://km.hosted.hookbox.org');
   conn.onOpen = function() { console.log("connection established!"); }
   conn.onError = function(err) { alert("connection failed: " + err.msg); }

   conn.subscribe("my_events"); 
	conn.onSubscribed = function(channelName, _subscription) {
		ourUsername = conn.username;
		console.log("subscribed and got username " + ourUsername);
		subscription = _subscription;

	 	addUsers(subscription.presence);

	 	subscription.onPublish = function(frame) {
	 		if (frame.user != ourUsername) {
	 			console.log(frame.user + " said: " + frame.payload);
				var post = JSON.parse(frame.payload);
				post.owner = false;
	 			html5team4.webdb.addPost(post);
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
	try {
		conn.publish("my_events", JSON.stringify(post));
	} catch (e) {
		console.log(e);
	}
}


function addUsers(users) {

	$.each(users, function(index, user) {
		addUserUnlessExists(user);
	});
}

function addUserUnlessExists(username) {
	var addUser = true;
	if($('span#'+username).length > 0) {
		addUser = false;
		return;
	}

	if (addUser == true) {
		var span = document.createElement('div');
		span.id = username;
		span.innerHTML = username;
		$('#online_users').append(span);
		$('div#'+username).effect('blind', {mode:"show"}, 1100);
	}
}

function removeUser(username) {
	var span = $('div#'+username);
	if (span != undefined) {
		span.effect('blind', {}, 1100);
	}
}
