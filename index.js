var noble = require('noble');
var attributes = require('./lib/attribute');
var config = require('./lib/config');
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://hostname.com', { username: 'username', password: 'password' })
var connected = false;
var inRange = {};
var packetsReceived = 0;
var lastPacketsReceived = 0;
var isScanning = false;

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});
client.on('connect', function () {
  connected = true;
});

noble.on('discover', function(peripheral) {
  packetsReceived++;
  var addr = peripheral.address;
  var id = addr;
  //todo add to array if not in the array and also check if its in there fo later on
  if (id in config.known_devices)
    id = config.known_devices[id];
  var entered = !inRange[addr];

  if (entered) {
    inRange[addr] = {
      id : id,
      address : addr,
      peripheral: peripheral,
      name : "?",
      data : {}
    };
  };
  inRange[addr].lastSeen = Date.now();
  inRange[addr].rssi = peripheral.rssi;

  console.log('hello my local name is:');
  console.log('\t' + peripheral.advertisement.localName);

  var serviceData = peripheral.advertisement.serviceData;

  if (serviceData && serviceData.length) {
    for (var i in serviceData) {
    if (inRange[addr].data[serviceData[i].uuid] &&
        inRange[addr].data[serviceData[i].uuid].payload.toString() == serviceData[i].data.toString() &&
        inRange[addr].data[serviceData[i].uuid].time > Date.now()-60000){
	    console.log("waiting....");
	}else{
      console.log('\t\t' + JSON.stringify(serviceData[i].uuid) + ': ' + JSON.stringify(serviceData[i].data.toString('hex')));
	    var n = attributes.getReadableAttributeName(serviceData[i].uuid);
      console.log(JSON.stringify(attributes.decodeAttribute(n,serviceData[i].data))+"\n");
      inRange[addr].data[serviceData[i].uuid] = { payload : serviceData[i].data, time : Date.now() };
      var extendedData = attributes.decodeAttribute(n,serviceData[i].data);
      if (connected && extendedData.temp) client.publish(inRange[addr].peripheral.id +'/temp', extendedData.temp.toString());
    }
   }
  }
  if (peripheral.advertisement.manufacturerData) {
    console.log('\there is my manufacturer data:');
    console.log('\t\t' + JSON.stringify(peripheral.advertisement.manufacturerData.toString('hex')));
  }
  if (peripheral.advertisement.txPowerLevel !== undefined) {
    console.log('\tmy TX power level is:');
    console.log('\t\t' + peripheral.advertisement.txPowerLevel);
  }

  console.log();
});
