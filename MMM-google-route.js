Module.register("MMM-google-route", {
    // Module config defaults
    defaults: {
        key: 'apy_key',
        height: '300px',
        width: '300px',
        title: '',
        refreshPeriod: 1,
        mapOptions:{},
        directionsRequest:{}
    },

    getScripts: function() {
        return [
            this.file('map-styles.js')
        ];
    },

    getDom: function () {
        var main = document.createElement("div");
        main.style.width = this.config.width;

        var title = document.createElement("div");
        title.setAttribute("id", "title");
        title.style.width="100%";
        title.innerHTML=this.config.title;

        var wrapper = document.createElement("div");
        wrapper.setAttribute("id", "map");
        wrapper.style.height = this.config.height;
        wrapper.style.width="100%";
        wrapper.style.display = "hidden";

        var info = document.createElement("div");
        info.style.width="100%";
        var infoTable = document.createElement("table");
        infoTable.setAttribute("id", "info");
        infoTable.style.height="100%";
        infoTable.style.width="100%";

        main.appendChild(title);
        main.appendChild(wrapper);
        main.appendChild(info);
        info.appendChild(infoTable);


        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://maps.googleapis.com/maps/api/js?key=" + this.config.key;
        document.body.appendChild(script);

        var self = this;
        script.onload = function () {
            var map = new google.maps.Map(document.getElementById("map"), {
                styles:mmmGoogleRouteMapStyles,
                zoomControl:false,
                streetViewControl:false,
                scaleControl:false,
                rotateControl:false,
                panControl:false,
                mapTypeControl:false,
                fullscreenControl:false
            });
            map.setOptions(self.config.mapOptions);
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

            function getDirections(){
                var dr = self.config.directionsRequest;
                if(!dr.travelMode)
                    dr.travelMode="DRIVING";
                if(dr.travelMode=="DRIVING"){
                    /* 
                     * departureTime is required for directions to take traffic into account.
                     * Also, it should be set to the current time or to a time in the future,
                     * let's set it to 1 minute from now by default.
                     */
                    var defaultDepartureTime = new Date(Date.now()+60*1000);
                    if(!dr.drivingOptions)
                        dr.drivingOptions={};
                    if(!dr.drivingOptions.departureTime)
                        dr.drivingOptions.departureTime = defaultDepartureTime;
                    if(dr.drivingOptions.departureTime < defaultDepartureTime)
                        dr.drivingOptions.departureTime = defaultDepartureTime;
                }
                if(dr.provideRouteAlternatives===undefined)
                    dr.provideRouteAlternatives=true;
                directionsService.route(
                    dr, 
                    function(response, status) {
                        if (status === 'OK') {                           
                            directionsDisplay1.setDirections(response);
                            directionsDisplay1.setRouteIndex(1);
                            directionsDisplay0.setDirections(response);
                            clearInfo();
                            addInfo(response,0);
                            addInfo(response,1);
                            wrapper.style.display="block";

                            // TODO display how old the information is
                        } else {
                            console.error('Directions request failed due to ' + status);
                        }
                    }
                );
            }

            getDirections();
            setInterval( getDirections, 1000 * 60 * self.config.refreshPeriod );
        };


        function clearInfo(){
            var table = document.getElementById("info");
            while(table.firstChild)table.removeChild(table.firstChild);
        }
        function addInfo(response,index){
            if(response.routes.length<=index)return;

            var table = document.getElementById("info");
            var tr = document.createElement("tr");
            var summary = document.createElement("td");
            var distance = document.createElement("td");
            var duration = document.createElement("td");

            if(index==0){
                tr.classList.add("bright");
            }

            summary.classList.add("small");
            distance.classList.add("small");

            var leg = response.routes[index].legs[0];
            if(leg.duration_in_traffic)
                duration.innerHTML = leg.duration_in_traffic.text;
            else
                duration.innerHTML = leg.duration.text;
            distance.innerHTML = leg.distance.text;
            summary.innerHTML = response.routes[index].summary;

            tr.appendChild(duration);
            tr.appendChild(distance);
            tr.appendChild(summary);
            table.appendChild(tr);
        }

        return main;
    }

});