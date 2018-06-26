/*
 * This file is part of EspruinoHub, a Bluetooth-MQTT bridge for
 * Puck.js/Espruino JavaScript Microcontrollers
 *
 * Copyright (C) 2016 Gordon Williams <gw@pur3.co.uk>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * ----------------------------------------------------------------------------
 *  Known Attributes and conversions for them
 * ----------------------------------------------------------------------------
 */

exports.names = {
 "1809" : "Temperature",
 "180a" : "Device Information",
 "180f" : "Battery Percentage",
 "181c" : "User Data",
 "feaa" : "Eddystone",
 "6e400001b5a3f393e0a9e50e24dcca9e" : "nus",
 "6e400002b5a3f393e0a9e50e24dcca9e" : "nus_tx",
 "6e400003b5a3f393e0a9e50e24dcca9e" : "nus_rx",
};

exports.handlers = {
 "1809" : function(a) { // Temperature
   return { 
     temp : (a.length==2) ? (((a[1]<<8)+a[0])/100) : a[0] 
   }
  },
 "180f" : function(a) { // Battery percent
   return { 
     battery : a[0] 
   }
  },
 "feaa" : function(d) { // Eddystone
   if (d[0]==0x10) { // URL
     var rssi = d[1];
     if (rssi&128) rssi-=256; // signed number
     var urlType = d[2];
     var URL_TYPES = [
        "http://www.",
        "https://www.",
        "http://",
        "https://"];
     var url = URL_TYPES[urlType] || "";
     for (var i=3;i<d.length;i++)
       url += String.fromCharCode(d[i]);
     return { url : url, "rssi@1m":rssi };
   }
  }
};

exports.getReadableAttributeName = function(attr) {
  for (var i in exports.names)
    if (exports.names[i]==attr) return i;
  return attr;
};

exports.decodeAttribute = function(name, value) {
  if (name in exports.handlers) {
    var r = exports.handlers[name](value);
    return r?r:value;
  }
  return value;
};

exports.lookup = function(attr) {
  for (var i in exports.names)
    if (exports.names[i]==attr) return i;
  return attr;
};
