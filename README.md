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
| `title`              | Optional title to show above the map.
| `height`             | Height of the map. <br><br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `width`              | Width of the map. <br><br>**Type:** `string` (pixels) <br> **Default value:** `300px`
| `useCalendarForDestination` | If enabled, directionsRequest will use the first calendar event with a location for the destination. (Note: the calendar module may take some time to update this module. The `destination` provided with `directionsRequest` will be used until the module can get calendar data.) <br><br>**Type:** `bool` <br> **Default value:** `false`
| `calendarClass`      | The class of the calendar module to be used as the destination. Only takes effect if `useCalendarForDestination` is set to `true`. <br><br>**Type:** `string` <br> **Default value:** `calendar`
| `refreshPeriod`      | Period between API requests.  <br><br>**Type:** `integer` (minutes) <br> **Default value:** `1`
| `fontSize`           | Size of the title and routes font. Use a percentage to specify size relative to default. <br>[HTML DOM Style fontSize property](https://www.w3schools.com/jsref/prop_style_fontsize.asp) <br><br>**Type:** `string` <br> **Default value:** `100%`
| `mapOptions`         | Map visualization options. [google.maps.MapOptions interface](https://developers.google.com/maps/documentation/javascript/reference/3/map#MapOptions) 


## Google API Key

Obtain an api key at [Google Developer's page](https://developers.google.com/maps/documentation/javascript/).

