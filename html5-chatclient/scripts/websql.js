function addDeleteEventListener(event) {
        console.log("Remove");
        $(event.currentTarget).parent().parent().fadeOut(200);
        var postId = $(this).attr('id');
        console.log(postId);
        html5team4.webdb.deletePost(postId);
}

//DB stuff

//Step 1
var html5team4 = {};
html5team4.webdb = {};

//Step 2
html5team4.webdb.db = null;

html5team4.webdb.open = function() {
    var dbSize = 5 * 1024 * 1024; // 5MB
    html5team4.webdb.db = openDatabase('chat', '1.0', 'post mangager', dbSize);
    console.debug(html5team4.webdb.db);
}

html5team4.webdb.onError = function(tx, e) {
    alert('Something unexpected happened: ' + e.message);
}

html5team4.webdb.onSuccess = function(tx, r) {
    html5team4.webdb.getAllPosts(loadPosts);
}

//Create Table
html5team4.webdb.createTable = function() {
    html5team4.webdb.db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
                'posts(ID INTEGER PRIMARY KEY ASC, nick TEXT, content TEXT, added_on DATETIME, owner BOOLEAN)', []);
    });
    console.debug("table crated");
}

//Select
html5team4.webdb.getAllPosts = function(renderFunc) {
    html5team4.webdb.db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM posts order by id desc', [], renderFunc,
                html5team4.webdb.onError);
    });
}

html5team4.webdb.getlastPosts = function(num) {
    html5team4.webdb.db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM posts order by id desc limit 5', [], renderLastPosts,
                html5team4.webdb.onError);
    });
}

//Insert
html5team4.webdb.addPost = function(post) {
    html5team4.webdb.db.transaction(function(tx) {
        var addedOn = new Date();
	console.debug("storing: " +JSON.stringify(post));
        tx.executeSql('INSERT INTO posts(nick, content, added_on, owner) VALUES (?,?,?,?)',
                [post.nick, post.content, addedOn, post.owner],
                html5team4.webdb.onSuccess,
                html5team4.webdb.onError);
    });
}

//Delete
html5team4.webdb.deletePost = function(id) {
    html5team4.webdb.db.transaction(function(tx) {
        tx.executeSql('DELETE FROM posts WHERE ID=?', [id],
                null, html5team4.webdb.onError);
    });
}

//Initializes database and render data
function init_db() {
    html5team4.webdb.open();
    html5team4.webdb.createTable();
    html5team4.webdb.getAllPosts(loadPosts);
}

//Render posts function
function loadPosts(tx, rs) {
    var rowOutput = "";
    var article = $('#articleContainer');
    article.empty();
    
    for (var i = 0; i < rs.rows.length; i++) {
        article.append(renderPost(rs.rows.item(i)));
    }
    scroll_down();
}

// Render last X posts
function renderLastPosts(tx, rs) {
    console.log("renderlast");
    var recentPostsUl = $('ul#recentPosts');
    for (var i = 0; i < rs.rows.length; i++) {
        var li = $('<li>');
        li.html(rs.rows.item(i).title);
        recentPostsUl.append(li);
    }
}

function renderPost(post) {
    console.debug(post);
    var article = $('<article>');
    if(post.owner === 'true') {
      article.addClass("our");
    }
    var header = $('<header>');
    header.append($('<h2>'+post.nick+'</h2>'));
    header.append($('Published<time datetime="'+post.added_on+'">'+post.added_on+'</time>'));
    article.append(header).append($('<p>'+post.content+'</p>'));
    return article;
}

function scroll_down() {
/*    var div = document.getElementById("articleContainer");
    // increase the scroll position by 10 px every 10th of a second
   if (div.scrollTop < div.scrollHeight - div.clientHeight) {
            div.scrollTop += div.scrollHeight; // move down
    }*/
}

