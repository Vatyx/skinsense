bluetoothAddress = '20-16-05-25-41-99';

var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

// all times in ms
const REFRESHRATE = 20;
const TRIGGERVAL = 1000;
const TAPTRIGGERTIME = 500;
const IGNORETIME = 100;
const BUFFERTIME = 2000;

var rawRolling1 = Array(BUFFERTIME/REFRESHRATE).fill(1023);
var rawRolling2 = Array(BUFFERTIME/REFRESHRATE).fill(1023);

var counter = 0;
var maxCounter = 20;
var under = false;
var drag = true;

function checkTap() {
  var currentValue = rawRolling1[rawRolling1.length - 1]
  var pastValue = rawRolling1[rawRolling1.length - 2]
  console.log(currentValue, counter)
  if(currentValue > TRIGGERVAL && under === false) {
    console.log("Nothing");
    return; //nothing is happening
  }

  if(currentValue > TRIGGERVAL && under === true && counter < maxCounter) {
    console.log("!!!!!!!This is a click~~~~~");
    under = false;
    counter = 0;
    return;
  }

  if(currentValue < TRIGGERVAL && drag === true) {
    if(currentValue - pastValue < 0) {
      console.log("up");
    } else if(currentValue - pastValue > 0) {
      console.log("down");
    }
  }

  if(currentValue > TRIGGERVAL && under === true && counter >= maxCounter) {
    under = false //end of drag;
    counter = 0;
    return;
  }

  if (currentValue < TRIGGERVAL && under === false) {
    console.log("Just went under");
    under = true; // starting a click/drag?
    return;
  }

  if(currentValue < TRIGGERVAL && under === true && counter < maxCounter) {
    console.log("Still waiting");
    counter++; //still waiting to see if it is a click
    return;
  }

  if(currentValue < TRIGGERVAL && under === true && counter >= maxCounter) {
    console.log("Now it's a drag");
    drag = true; //now it's a drag
    return;
  }

  console.log("something else?");
  under = false;
  drag = false;
  counter = 0;
}

var rawSerialString = '';
btSerial.on('found', function(address, name) {
  if(address === bluetoothAddress) {
    process.stdout.write('Arduino found, connecting... ');
    btSerial.findSerialPortChannel(address, function(channel) {
        btSerial.connect(address, channel, function() {
            console.log('Done!');

            btSerial.write(new Buffer('my data', 'utf-8'), function(err, bytesWritten) {
                if (err) console.log(err);
            });

            btSerial.on('data', function(buffer) {
                rawSerialString += buffer.toString('utf-8');

                if (!rawSerialString.includes(']')) {
                  return;
                }

                var rawData;
                try {
                  rawData = JSON.parse(rawSerialString);
                  //console.log(rawData[0]);

                  rawRolling1.push(rawData[0]);
                  rawRolling1.shift();

                  checkTap();
                } catch (e) {
                  rawSerialString = '';
                   //console.log('TRANSMISSION ERROR');
                }
            });
        }, function () {
            console.log('Connection Error Type 1');
        });

        // close the connection when you're ready
        btSerial.close();
    }, function() {
        console.log('Connection Error Type 2');
    });
  }
});

btSerial.inquire();
