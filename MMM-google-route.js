Module.register("MMM-google-route", {
    // Module config defaults
    defaults: {
        key: 'apy_key',
        height: '300px',
        width: '300px',
        title: '',
        refreshPeriod: 1,
        minimumRefreshPeriod: 0,
        showAge: true,
	showMap: true,
        mapOptions:{},
	language: "en",
        directionsRequest:{},
        fontSize:undefined,
        listen:[]
    },

    state: {
        refreshTimer: undefined,
        lastRefresh: undefined,
        ageTimer: undefined,
        overrideDestination: undefined
    },

    getDirections: function(){/* NOP until initilized */},

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
        title.style.fontSize=this.config.fontSize;
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

        var age =  document.createElement("div");
        age.style.width="100%";
        age.style.fontSize = this.config.fontSize;
        age.style.textAlign = 'right';
        age.classList.add('small','dimmed');

        main.appendChild(title);
	if(this.config.showMap)
	        main.appendChild(wrapper);
        main.appendChild(info);
        info.appendChild(infoTable);
        if(this.config.showAge)
            main.appendChild(age);

        var self = this;
        function mapsScriptLoaded() {
            var map = new google.maps.Map(wrapper, {
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

            var lastDirectionsTime;

            function getDirections(){
                /*
                  minimumRefreshPeriod is useful when used in combination with listened events,
                  such as USER_PRESENCE.
                */
                if (
                    self.config.minimumRefreshPeriod &&
                    (Date.now() - lastDirectionsTime < self.config.minimumRefreshPeriod * 1000 * 60)
                ) {
                    return;
                }
                try{
                    var dr = Object.assign({},self.config.directionsRequest);
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
                    if(self.state.overrideDestination){
                        dr.destination = self.state.overrideDestination;
                    }
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
                                self.lastRefresh = moment(); // Should always be available as it is used by default 'clock' plugin
                                updateAge();
                            } else {
                                clearInfo();
                                addError("Google directions service status: "+status);
                            }
                        }
                    );
                }catch(err){
                    clearInfo();
                    addError("getDirections failed due to "+err.name+" : "+err.message);
                }
                lastDirectionsTime = Date.now();
            }

            getDirections();
            if(self.config.refreshPeriod){
                if(self.state.refreshTimer) clearInterval(self.state.refreshTimer);
                self.state.refreshTimer = setInterval( getDirections, 1000 * 60 * self.config.refreshPeriod );
            }

            function updateAge() {
                if(self.config.showAge && self.lastRefresh){
                    age.innerHTML = self.lastRefresh.fromNow();
                }
            }
            if(self.config.showAge && !self.state.ageTimer){
                self.state.ageTimer = setInterval(updateAge,5000);
            }

            self.getDirections = getDirections;
        };

        function hasMapsScript(src){
            for(s of document.scripts){
                if(s.src == src)return true;
            }
            return false;
        }

        function waitMapsScript(){
            setTimeout(function(){
                try{
                    // We could get 'google is not defined' exception here if maps script has not been loaded
                    if(google && google.maps && google.maps.Map){
                        mapsScriptLoaded();
                        return;
                    }
                }catch(e){}
                waitMapsScript();
            },1000);
        }

        var mapsSrc = "https://maps.googleapis.com/maps/api/js?key=" + this.config.key + "&language=" + this.config.language;
        if(! hasMapsScript(mapsSrc)){
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = mapsSrc;
            document.body.appendChild(script);
            script.onload = mapsScriptLoaded;
        }else{
            waitMapsScript();
        }

        function clearInfo(){
            var table = infoTable;
            while(table.firstChild)table.removeChild(table.firstChild);
        }
        function addInfo(response,index){
            if(response.routes.length<=index)return;

            var table = infoTable;
            var tr = document.createElement("tr");
            var summary = document.createElement("span");
            var distance = document.createElement("span");
            var duration = document.createElement("span");
            var departure = document.createElement("span");

            if(index==0){
                tr.classList.add("bright");
            }

            summary.style.fontSize = self.config.fontSize;
            distance.style.fontSize = self.config.fontSize;
            duration.style.fontSize = self.config.fontSize;
            departure.style.fontSize = self.config.fontSize;

            var leg = response.routes[index].legs[0];
            if(leg.duration_in_traffic)
                duration.innerHTML = leg.duration_in_traffic.text;
            else
                duration.innerHTML = leg.duration.text;
            if(leg.departure_time)
                departure.innerHTML = leg.departure_time.text;
            distance.innerHTML = leg.distance.text;
            summary.innerHTML = response.routes[index].summary;

            function addCell(tr,classname,content){
                var cell = document.createElement("td");
                if(classname)cell.classList.add(classname);
                cell.appendChild(content);
                tr.appendChild(cell);
            }
            addCell(tr,"",duration);
            addCell(tr,"small",departure);
            addCell(tr,"small",distance);
            addCell(tr,"small",summary);
            table.appendChild(tr);
        }
        function addError(error){
            var table = infoTable;
            var tr = document.createElement("tr");
            var cell = document.createElement("td");
            var span = document.createElement("span");
            span.innerHTML = error;
            cell.classList.add("small");
            cell.appendChild(span);
            tr.appendChild(cell);
            table.appendChild(tr);
        }

        return main;
    },

    notificationReceived: function(notification, payload, sender) {
        // Handle module notifications
        if(notification === "MMM-google-route/refresh"){
            this.getDirections();
            return;
        }

        // Check if it's a desired notification
        if(this.config.listen.indexOf(notification)<0)
            return;

        var override = undefined;

        // Let's see if we can handle destination override
        if (notification === "CALENDAR_EVENTS") {
            // Ok, we should be able to handle this
            for (var e in payload) {
                var event = payload[e];
                if(event.location){
                    override = event.location;
                }
                if(override)break;
            }
        } else {
            // No destination override, just update the route.
            this.getDirections();
            return;
        }
        // Update the destination override if needed
        if(override){
            var o = this.state.overrideDestination;
            if(JSON.stringify(this.state.overrideDestination) != JSON.stringify(override)){
                // New override
                this.state.overrideDestination = override;
                this.getDirections();
            }
        }else if(this.state.overrideDestination){
            // No more overrides
            this.state.overrideDestination = undefined;
            this.getDirections();
        }
    }

});
