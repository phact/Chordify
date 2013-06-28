var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;


var scrollSpeed = 0;
var scrollInterval = 0;

exports.init = init;

function init() {

	updatePageWithTrackDetails();

	player.observe(models.EVENT.CHANGE, function (e) {

		// Only update the page if the track changed
		if (e.data.curtrack == true) {
			updatePageWithTrackDetails();
		}
	});
}

function updatePageWithTrackDetails() {
	
	var header = document.getElementById("header");
	var cont = document.getElementById("cont");

	// This will be null if nothing is playing.
	var playerTrackInfo = player.track;

	if (playerTrackInfo == null) {
		header.innerText = "Nothing playing!";
	} else {
  
		var track = playerTrackInfo.data;
		header.innerHTML = track.name + "/" + track.album.artist.name;
		cont.innerHTML = 'loading Chords..'
		console.log('open')
		var req = new XMLHttpRequest();
		req.open("GET",'http://chordify.herokuapp.com/api/getChords/'+ track.album.artist.name +'/'+track.name, true);
		req.onreadystatechange = function() {
			console.log('ret')
	   		if (req.readyState == 4) {
	   			console.log(req.status)
	    		if (req.status == 200) {
	    			console.log('200')
            cont.innerHTML = req.responseText.substring(req.responseText.search('find the application.') + 21)
            //Set scroll speed
            scrollSpeed  = player.track.duration / ($(document).height() - 762);
            $( "#slider-vertical" ).slider("value", scrollSpeed);
            $( "#amount" ).val( scrollSpeed );
            
            pageScroll(scrollSpeed);
	     		}
	   		}
	  	};

		req.send();
	}
}

function pageScroll(speed) {
  window.clearInterval(scrollInterval);
  scrollInterval = setInterval(function(){window.scrollBy(0,1)} , speed);
}

$(function() {
  $( "#slider-vertical" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 200,
    value: scrollSpeed,  
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.value );
      pageScroll(ui.value);
    }
  });
  $( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
});

