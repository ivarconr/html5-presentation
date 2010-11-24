$(function() {
    $('#addPostLink').click(function() {
        $('#addPost').slideToggle(150, null);
    });

    $('form#addPost').submit(function(obj) {
        
    	var nick = ourUsername;
    	var content = $('#content').val();
            
    	var post = {nick: nick, content: content};
        html5team4.webdb.addPost(post);
        publishPost(post);
		  cont.val('');
    
      return false;
    });



    //Init DB stuff
    init_db();
});



