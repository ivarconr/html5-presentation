$(function() {
    $('#addPostLink').click(function() {
        $('#addPost').slideToggle(150, null);
    });

    $('form#addPost').submit(function(obj) {
        
    	var nick = ourUsername;
    	var content = $('#content');
	var text = content.val();
            
    	var post = {nick: nick, content: text, addedOn: new Date(), owner: true};
        webdb.addPost(post);
		        
	publishPost(post);
        content.val('');
    
      return false;
    });

});


function renderPost(post, history) {
    var article = $('<article>');
    if(post.owner === 'true') {
      article.addClass("our");
    }
    if(history) {
      article.addClass("history");
    } 
    var header = $('<header>');
    header.append($('<h2>'+post.nick+'</h2>'));
    header.append($('Published<time datetime="'+post.added_on+'">'+post.added_on+'</time>'));
    article.append(header).append($('<p>'+post.content+'</p>'));
    return article;
}

function addPost(post) {
    console.debug(post);
    var container = $('#articleContainer');
    container.prepend(renderPost(post));
}


