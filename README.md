## RuuviTag OpenHAB bridge

This is a small script to scan the BLE range and collect data from RuuviTag's running espruino and post to mqqt. This is not specific to openHAB but this is my usecase. Collecting the information to post to mqtt that openhab is subscribed to.

Credits to [EspruinoHUB](https://github.com/espruino/EspruinoHub) for  a basis for this project. 

# Setup

## Server
- Clone this repo
- `npm install`
- Open index.js and make sure authentication details are correct if using any for mqtt
- Run - `node index.js`

## Ruuvi
- Install espruino on RuuviTag (ruu.vi/setup)
- Connect to Ruuvi with IDE (espruino.com/ide)
- Upload snippet found in `ruuvi.js`
- Disconnect and run server side script

Also see http://www.mrwhal3.com/articles/2017-04/RuuviTag
