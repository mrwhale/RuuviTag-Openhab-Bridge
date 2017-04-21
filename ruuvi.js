// test  temperature
var C = {
  every_30_sec : 30000,
  setTemp : NRF.setServices,
  updateTemp : NRF.updateServices,
};
/*function publishTemp(fn) {
  //digitalPulse(LED2, 0, 200);
  //digitalWrite(LED2,0);
    fn({
      0x1809 : { // Health Thermometer
        0x2A6E: {
          readable: true,
          broadcast: true,
          value : [E.getTemperature().toFixed(2)]
    }}});
} */
// first time
//publishTemp(C.setTemp);
// every 30 sec
//setInterval(publishTemp,C.every_30_sec,C.updateTemp);

setInterval(function(fn){
  console.log(E.getTemperature());
},60000);

setInterval(function() {
  NRF.setAdvertising({
    0x1809 : E.getTemperature()
  });
}, 60000);