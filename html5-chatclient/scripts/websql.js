$(function() {
    init_db();
});

//Initializes database and render data
function init_db() {
    webdb.open();
    webdb.createTable();
    webdb.getAllPosts(loadAllPosts);
}


webdb = {};
webdb.db = null;

webdb.open = function() {
    var dbSize = 5 * 1024 * 1024; // 5MB
    webdb.db = openDatabase('chat', '1.0', 'FancyChat database', dbSize);
    console.debug(webdb.db);
}

webdb.onError = function(tx, e) {
    alert('Something unexpected happened: ' + e.message);
}

webdb.onSuccess = function(tx, result) {
    console.debug(result.insertId);
    webdb.getPost(result.insertId, loadPost);
}

//Create Table
webdb.createTable = function() {
    webdb.db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
                'posts(ID INTEGER PRIMARY KEY ASC, nick TEXT, content TEXT, added_on DATETIME, owner BOOLEAN)', []);
    });
    console.debug("table crated");
}

//Select all chat posts
webdb.getAllPosts = function(renderFunc) {
    webdb.db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM posts order by id desc', [], renderFunc, webdb.onError);
    });
}

//Select chat posts
webdb.getPost = function(id, renderFunc) {
    webdb.db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM posts WHERE ID=?', [id], renderFunc, webdb.onError);
    });
}

//Insert new chat post
webdb.addPost = function(post) {
    webdb.db.transaction(function(tx) {
        console.debug("storing: " + JSON.stringify(post));
        tx.executeSql('INSERT INTO posts(nick, content, added_on, owner) VALUES (?,?,?,?)',
                [post.nick, post.content, post.addedOn, post.owner],
                webdb.onSuccess,
                webdb.onError);
    });
}

//Delete
webdb.deletePost = function(id) {
    webdb.db.transaction(function(tx) {
        tx.executeSql('DELETE FROM posts WHERE ID=?', [id], null, webdb.onError);
    });
}

//Render posts function
function loadAllPosts(tx, rs) {
    var rowOutput = "";
    var article = $('#articleContainer');
    article.empty();

    for (var i = 0; i < rs.rows.length; i++) {
        article.append(renderPost(rs.rows.item(i), true));
    }
}
function loadPost(tx, rs) {
    console.debug(rs);
    for (var i = 0; i < rs.rows.length; i++) {
        addPost(rs.rows.item(i));
    }
}


