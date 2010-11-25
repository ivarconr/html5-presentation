$(function() {
    $('#addPostLink').click(function() {
        $('#addPost').slideToggle(150, null);
    });

    $('form#addPost').submit(function(obj) {
        
    	var nick = ourUsername;
    	var content = $('#content');
		var text = content.val();
            
    	var post = {nick: nick, content: text, owner: true};
        html5team4.webdb.addPost(post);
	      
	publishPost(post);
        content.val('');
    
      return false;
    });



    //Init DB stuff
    init_db();
});



