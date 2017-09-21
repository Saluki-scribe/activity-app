function places () {

$("#display").append('<div id ="map">This works!</div>');

    // for now, the only input received by this function is 'zip' (zip code) - global
  
    var map;
    var service;
    var infowindow;
    var searchRad = '1000'; //default value for search radius (it's not miles- kilometers? small area)
    var lat, lng;
    
    var theme;        // this variable will hold the selected activity
    var placeLink, tableDiv;    //used for output to document
    var activityPlaces = ['aquarium','bowling_alley','night_club','amusement_park','art_gallery','movie_theater','museum','restaurant'];
    
    var ranNum  = 0;  //default ran # to select activity type
    var itemSel = 0;  //default ran # to select random result (if there is one or more)
    
    ranNum = Math.floor(Math.random()*8); //used to select a random activity
    theme = activityPlaces[ranNum];
      
    console.log('Random number is '+ranNum+ ', and the theme is '+theme);

    var cors = "https://cors-bcs.herokuapp.com/"   
    var zipUrl = cors + "https://www.zipcodeapi.com/rest/OupZPnT4uALMa6qNSjiMWbEKvcYjSbHGF7FuuzzYalKksa8ktq7qBLb7X9qQl8w0/info.json/" + zip + "/degrees"
    
    $.ajax({        // this request is listed first, but it logs second (after groupon)
        url: zipUrl,
        method:  "GET",
    }).done(function cityName(response){
        console.log(response);
        lat = response.lat;
        lng = response.lng;        

        
      google.maps.event.addDomListener(window, 'load', initialize);
      
      // latitude and longitude will be variables.  Right now I have it
      // set near I-drive to get some good results of varying types.

      //var city = new google.maps.LatLng(28.45000,-81.4700);
    
      var city = new google.maps.LatLng(lat,lng);

      function initialize() {

      console.log("Initialize is called");
      
      map = new google.maps.Map(document.getElementById('map'), {
          center: city,
          zoom: 15      //zoom: 0 shows the whole earth.  Bigger #'s are closer
        });         // draw the map (zoom: 15 gives a map that's about 1 mile to a side)
    
      var request = {
        location: city,
        radius: searchRad,    //search by the selected radius
        type: [theme]     //search according to selected theme
      };        //end of request parameter object
    
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

    }           // end of initialize function

    
    tableDiv = $('<table>');    //set up display div
    tableDiv.html('<tr><th> </th><th> Google Places </th></tr>');
    
    function callback(results, status) {
      
      console.log("the callback function totally works!");
      itemSel = Math.floor(Math.random()*results.length);

      if (status == google.maps.places.PlacesServiceStatus.OK) {
        //for (var i = 0; i < results.length; i++) {
          var place = results[itemSel];
          console.log(results[itemSel]);
          console.log(results[itemSel].name, results[itemSel].vicinity);
          console.log("this works");
          //create a link to the website, then a table div to display results

          //placeLink = '<a href ='+results[itemSel].dealUrl+' target = "_blank"> Groupon Link </a>'
          console.log("placeLink = " + placeLink);
          tableDiv.append('<tr><th> Name  </th><td> '+ results[itemSel].name +'</td></tr><tr><th> Location </th><td> '+ results[itemSel].vicinity + '</td></tr>')
          //tableDiv.append(results[itemSel].photos[0].html_attributions) //this is formatted as an 'a' element
  
          var marker = new google.maps.Marker({
             map: map,
             position: place.geometry.location
            });     //end of marker placement block
 
        //}       //end of 'for' loop that collects results
      }         // end of 'if' block for places search

      return tableDiv;
    }           // end of callback function
        
    });   // end of zip

    $("#display").prepend("This works too!" + tableDiv); //insert table into document
    
}   // end of function 'places' block

