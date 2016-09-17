var BTSP = require('bluetooth-serial-port');
var serial = new BTSP.BluetoothSerialPort();

var ADDRESS = '78-40-84-ab-ce-b0'

serial.on('found', function(address, name) {

  // you might want to check the found address with the address of your
  // bluetooth enabled Arduino device here.
  console.log(address, name);

  serial.findSerialPortChannel(address, function(channel) {
    console.log(channel)
    serial.connect(ADDRESS, channel, function() {
          console.log('connected');
          process.stdin.resume();
          process.stdin.setEncoding('utf8');
          console.log(
              'Press "1" or "0" and "ENTER" to turn on or off the light.')

          process.stdin.on('data', function(data) { serial.write(data); });

          serial.on('data',
                    function(data) { console.log('Received: ' + data); });
        },
        function() { console.log('cannot connect'); });
  });
});

serial.inquire();
