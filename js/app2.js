var bars = [
    {
        name: "Kingfish",
        position: {lat: 37.8384359, lng:-122.2646402},
        marker:'',
        infowindow:'',
        ct:''
    },
    {
        name: "The Graduate",
        position: {lat: 37.8495652, lng:-122.2541683},
        marker:'',
        infowindow:'',
        ct:''
    },
    {
        name: "Barclays",
        position: {lat: 37.8480205, lng:-122.254022},
        marker:'',
        infowindow:'',
        ct:''
    },
    {
        name: "Ben and Nick's",
        position: {lat: 37.8435491, lng:-122.253685},
        marker:'',
        infowindow:'',
        ct:''
    },
    {
        name: "George & Walt's",
        position: {lat: 37.8410735, lng:-122.2538017},
        marker:'',
        infowindow:'',
        ct:''
    }
]




function yelp_api(biz){

    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
    }

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
          success: function(results) {
            // Do stuff with results
            $('body').append("<div>"+results.businesses[0].snippet_text+"<div>");
            //console.log(results);
          },
          fail: function() {
            // Do stuff on fail
          }
        };

        // Send AJAX query via jQuery library.
        $.ajax(settings);
}

for (i = 0; i < bars.length; i++) {

    yelp_api(bars[i].name);

}




