// ==== script for parallax effect ==== //
// do you have to disable for small screens or will it just not happen?
$(function() {
   //cache the window object
    var $window = $(window);
    
    //parallax effect
    $('section[data-type="background"]').each(function() {
       var $bgobj = $(this); //assigning the object
        
        $(window).scroll(function() {
           //scroll the background at var speed
            //the ypos is a negative value because it's going up
            
            var yPos = - ($window.scrollTop() /$bgobj.data('speed'));
            
            //put together our final background position '50%+ yPos + 'px' works for hero
            var coords = '80%'+ yPos + 'px';
            
            //move the background
            $bgobj.css({ backgroundPosition: coords });
            
        }); //end window scroll
    });
});

