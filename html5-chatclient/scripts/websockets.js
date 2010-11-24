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
	 users.push(ourUsername);
	 updateUserList();
	 console.log("onsubscribed with username " + ourUsername);
	 subscription = _subscription;

	 subscription.onPublish = function(frame) {
	 	if (frame.user != ourUsername) {
	 		console.log(frame.user + " said: " + frame.payload);
	 		html5team4.webdb.addPost(JSON.parse(frame.payload));
	 	}
	 }

	 subscription.onSubscribe = function(frame) {
				console.log(frame.user + " connected");
				users.push(frame.user);
				updateUserList();
	 }

	 subscription.onUnsubscribe = function(frame) {
				console.log(frame.user + " disconnected");
				var toRemove = -1;
				$.each(users, function(index, user) { 
					if(frame.user == user) {
						toRemove = index;
					}
				});

				if(toRemove != -1) {
					users.splice(toRemove, 1)
				}
				updateUserList();
	 		}

	 }




});

function publishPost(post) {
	  console.log("skal publishe %o ", post);
	  console.log(subscription);
	  try {
				 conn.publish("my_events", JSON.stringify(post));

	  } catch (e) {
				 console.log(e);
	  }
}
function updateUserList() {
   console.debug("update users")
   var container = $('#online_users');
   container.empty();
   $.each(users, function(index, user) { 
     console.debug("adding %s to online users", user)
     container.append(user + "<br />");
   });
}
