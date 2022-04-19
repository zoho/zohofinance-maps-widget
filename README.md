# zohofinance-maps-widget

A sample zoho finance widget which help users to pick address of his customers by clicking location from google map.


##### Components Used: :exclamation:

    Widgets - User Interface to select the location from google map, the selected address is  shipping or billing and so on. 
    Global Field - Used to store google API Key.
    Connections -  To get the global field information in widget.


## Prerequesties:

In this repository , We have a source code of widgets only.
This widget uses the global field and connections.

To make this widget work in Development mode, you need to create global field and connections.
1. Create a global field in your extension and replace the API name [here](https://github.com/zoho/zohofinance-maps-widget/blob/5607442a85f6df22da94a9901c06c1fa8a10cabc/app/js/pick_address.js#L14)
2. Create a connections for books and as like mentioned in [plugin-manifest.json](https://github.com/zoho/zohofinance-maps-widget/blob/5607442a85f6df22da94a9901c06c1fa8a10cabc/plugin-manifest.json#L20).   
              
## Development Process:
* Clone this Repository
* Run `npm install` 
* Run `zet run` (To run your application in https://localhost:5000)
* Enable the developer mode in zoho books.
* Now, In Customer creation page, you have sidebar widget, which will help to choose the address.

