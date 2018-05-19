Module.register("MMM-google-route", {
    // Module config defaults
    defaults: {
        key: 'apy_key',
        height: '300px',
        width: '300px',
        title: '',
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
        main.style.height = this.config.height;
        main.style.width = this.config.width;

        var title = document.createElement("div");
        title.setAttribute("id", "title");
        title.style.height="10%";
        title.style.width="100%";
        title.innerHTML=this.config.title;

        var wrapper = document.createElement("div");
        wrapper.setAttribute("id", "map");
        wrapper.style.height="90%";
        wrapper.style.width="100%";
        wrapper.style.display = "hidden";

        var info = document.createElement("div");
        info.style.height="10%";
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
                styles:mmmGoogleRouteMapStyles
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
            directionsService.route(
                self.config.directionsRequest
                , 
                function(response, status) {
                    if (status === 'OK') {
                        directionsDisplay0.setDirections(response);
                        directionsDisplay1.setDirections(response);
                        directionsDisplay1.setRouteIndex(1);
                        addInfo(response,0);
                        addInfo(response,1);
                        wrapper.style.display="block";
                    } else {
                        console.error('Directions request failed due to ' + status);
                    }
                }
            );
        };

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

            duration.innerHTML = response.routes[index].legs[0].duration.text;
            distance.innerHTML = response.routes[index].legs[0].distance.text;
            summary.innerHTML = response.routes[index].summary;

            tr.appendChild(duration);
            tr.appendChild(distance);
            tr.appendChild(summary);
            table.appendChild(tr);
        }

        return main;
    }

});