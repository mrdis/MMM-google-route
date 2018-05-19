Module.register("MMM-google-route", {
    // Module config defaults
    defaults: {
        key: 'apy_key',
        height: '300px',
        width: '300px',
        directionsRequest:{}
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("id", "map");

        wrapper.style.height = this.config.height;
        wrapper.style.width = this.config.width;

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + this.config.key;
        document.body.appendChild(script);

        var self = this;
        script.onload = function () {            
            var map = new google.maps.Map(document.getElementById("map"), {
            });
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay0 = new google.maps.DirectionsRenderer({
                suppressMarkers : true,
                polylineOptions:{
                    strokeColor:'#fff',
                    strokeWeight:7
                }
            });
            var directionsDisplay1 = new google.maps.DirectionsRenderer({
                suppressMarkers : true,
                polylineOptions:{
                    strokeColor:'#aaa',
                    strokeWeight:5
                }
            });
            directionsDisplay0.setMap(map);
            directionsDisplay1.setMap(map);
            directionsService.route(
                self.config.directionsRequest
                , 
                function(response, status) {
                    if (status === 'OK') {
                        directionsDisplay0.setDirections(response);
                        directionsDisplay1.setDirections(response);
                        directionsDisplay1.setRouteIndex(1);
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                });
        };

        return wrapper;
    }

});