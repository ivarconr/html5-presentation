$(function() {
    $('#addPostLink').click(function() {
        $('#addPost').slideToggle(150, null);
	return false;
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
    var date = new Date(post.added_on);
    var article = $('<article>');
    if(post.owner === 'true') {
      article.addClass("our");
    }
    if(history) {
      article.addClass("history");
    } 
    var header = $('<header>');
    header.append($('<h2>'+post.nick+' says:</h2>'));
    header.append($('Published<time datetime="'+date+'">'+
	date.getDay()+'.'+date.getMonth()+'.'+date.getFullYear()+' - '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+''+'</time>'));
    article.append(header).append($('<p>'+post.content+'</p>'));
    return article;
}

function addPost(post) {
    console.debug(post);
    var container = $('#articleContainer');
    container.prepend(renderPost(post));
}


