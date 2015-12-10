//create model

var bars = [
    {
        name: "Kingfish",
        position: {lat: 37.8384359, lng:-122.2646402},
        marker:''
    },
    {
        name: "The Graduate",
        position: {lat: 37.8495652, lng:-122.2541683},
        marker:''
    },
    {
        name: "Barclays",
        position: {lat: 37.8480205, lng:-122.254022},
        marker:''
    },
    {
        name: "Ben and Nick's",
        position: {lat: 37.8435491, lng:-122.253685},
        marker:''
    },
    {
        name: "George & Walt's",
        position: {lat: 37.8410735, lng:-122.2538017},
        marker:''
    }
]


//This function take bar name and marker from the model and makes an AJAX call to the YELP API. 
//The data from YELP is set as the content for the marker's infowindow
function yelp_api(biz, marker){

    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
    }

    //this section is adapted from https://discussions.udacity.com/t/im-having-trouble-getting-started-using-apis/13597  
    
    var yelp_url = "https://api.yelp.com/v2/search";

    YELP_KEY = "0N-K-n12E2nqVE8ROFiHPQ"
    YELP_TOKEN = "CE-KH7BjJeVBkNyM-isXEcnH6xRPnIh8"
    YELP_KEY_SECRET = "t7SlBR7jha2TWhU64GPehMoAftE"
    YELP_TOKEN_SECRET = "YXo_6LJxguAbPspjG507yTWRZPs"

        var parameters = {
          oauth_consumer_key: YELP_KEY,
          term: biz,
          location: 'oakland',
          limit: 1,
          oauth_token: YELP_TOKEN,
          oauth_nonce: nonce_generate(),
          oauth_timestamp: Math.floor(Date.now()/1000),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_version : '1.0',
          callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
        };

        var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
        parameters.oauth_signature = encodedSignature;

        var settings = {
          url: yelp_url,
          data: parameters,
          cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
          dataType: 'jsonp',
          success: function(results, marker) {
            // Do stuff with results
            infowindow.setContent("<div class='iwin'><p><h2><a href="+results.businesses[0].url + " target='_blank'>"+biz+"</a></h2></p><img src=" + results.businesses[0].image_url + "></img><br><img src=" + results.businesses[0].rating_img_url + "></img><p>" + results.businesses[0].snippet_text + "</p></div>");
            // results.businesses[0].url);
            console.log(results);
            //console.log(results);
          },
          fail: function() {
            infowindow.setContent("Something went wrong with Yelp API. Please try again.")
            // Do stuff on fail
          }
        };

        // Send AJAX query via jQuery library.
        $.ajax(settings);
}

var ViewModel = function() {
	var self = this;

    this.query = ko.observable("");

    //toggle the appropriate marker when the user click on the li
    this.vmBounce = function(marker) {
      toggleBounce(this.marker);
    }

    //show markers and list items based on the input box.
    this.barList = ko.computed(function() {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(bars, function(bar) {
          if (bar.name.toLowerCase().indexOf(search) >=0) {
            if(bar.marker)
              bar.marker.setMap(map); 
          } else {
            if(bar.marker)
              bar.marker.setMap(null);
          }               
            return bar.name.toLowerCase().indexOf(search) >= 0;
        });
    }, this);




}

ko.applyBindings(new ViewModel())

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
    } 
  else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: bars[0].position,
    zoom: 14
    });

    if (!map) {
      alert("Currently Google Maps is not available. Please try again later!");
      return;
    } 
    
    var marker, i;

    markers = [];

    //create a marker with an infowindow for each bar in the model.
    for (i = 0; i < bars.length; i++) {  
        marker = new google.maps.Marker({
            position: bars[i].position,
            map: map,
            animation: google.maps.Animation.DROP
        });

        infowindow = new google.maps.InfoWindow({
            content: "",
            maxWidth: 200
        });  

        //bars[i].infowindow = infowindow;
        bars[i].marker=marker

        google.maps.event.addListener(marker, 'click', function(i) {
            return function() {
                yelp_api(bars[i].name, bars[i].marker);
                infowindow.close();
                map.setCenter(bars[i].marker.getPosition());
                console.log(bars[i].marker.getPosition());
                infowindow.open(map, bars[i].marker);
            }
        }(i));  


    }
}

 
