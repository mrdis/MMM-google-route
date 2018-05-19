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
| `key`                | *Required* Google api key. See below for help.
| `directionsRequest`  | *Required* The directions to show on the map. [google.maps.DirectionsRequest interface](https://developers.google.com/maps/documentation/javascript/reference/3/directions#DirectionsRequest)
| `height`             | Height of the map. <br><br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `width`              | Width of the map. <br><br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `mapOptions`         | Map visualization options. [google.maps.MapOptions interface](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions) 


## Google API Key

Obtain an api at [Google Developer's page](https://developers.google.com/maps/documentation/javascript/).

