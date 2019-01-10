# MMM-google-route

![Alt text](/screenshot.png "A preview of the MMM-google-route module.")

A module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) that displays the two best 
routes from an origin to a destination, using Google Directions API.

## Using the module

To use this module, clone this repo to your `MagicMirror/modules/` directory.

`git clone https://github.com/mrdis/MMM-google-route.git`

And add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [

        {
            module: 'MMM-google-route',
            position: 'top_left',
            config: {
                key: '<YOUR_KEY>',
                directionsRequest:{
                    origin: '<ROUTE START>',
                    destination: '<ROUTE FINISH>'
                }
            }
        }

    ]
}
```

## Configuration options

| Option               | Description
|--------------------- |-----------
| `key`                | *Required* Google api key. See below for help. <br>**Type:** `string`
| `directionsRequest`  | *Required* The directions to show on the map. <br>**Type:** [google.maps.DirectionsRequest interface](https://developers.google.com/maps/documentation/javascript/reference/3/directions#DirectionsRequest)
| `title`              | Optional title to show above the map. <br>**Type:** `string`
| `height`             | Height of the map. <br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `width`              | Width of the map. <br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `refreshPeriod`      | Period between API requests. <br>**Type:** `integer` (minutes) <br> **Default value:** `1`
| `fontSize`           | Size of the title and routes font. Use a percentage to specify size relative to default. <br>[HTML DOM Style fontSize property](https://www.w3schools.com/jsref/prop_style_fontsize.asp) <br>**Type:** `string` <br> **Default value:** `100%`
| `mapOptions`         | Map visualization options. <br>**Type:** [google.maps.MapOptions interface](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions) 
| `listen`             | Use destination information provided by other modules. <br>Specify the ID of the notifications to listen for. <br>**Type:**  `string[]` <br> **Default value:** `[]`


## Google API Key

Obtain an api key at [Google Developer's page](https://developers.google.com/maps/documentation/javascript/).

## Google directions service errors

If "Google directions service status:" error message appears, it means that the request to the Google directions service failed for some reason.

The list of error codes and their meanings can be found [here](https://developers.google.com/maps/documentation/javascript/directions#DirectionsStatus). 

## Importance of correct date/time settings

If "Google directions service status: INVALID_REQUEST" error message appears, it could be due to an invalid setting of the current date and time on the device that is displaying the mirror interface.

This is due to the `departureTime` field of the [drivingOptions](https://developers.google.com/maps/documentation/javascript/directions#DrivingOptions) field passed to the directions API being set to one minute from the current time, and google service checking that this timestamp is in the future.

## Notifications supported as destination providers
### CALENDAR_EVENTS
The first valid `location` field of the events contained in the notification payload will be used as destination.

