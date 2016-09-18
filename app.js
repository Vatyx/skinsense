var SerialPort = require('serialport');
var port = new SerialPort('/dev/cu.usbmodem1421');

port.on('open', function() {
  console.log('OPENED')
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

var modeHandler = require('./modes').modeHandler;

const functionBestFit = '-600+(19169 x)/30+(30433 x^2)/360-(1751 x^3)/16+(4009 x^4)/144-(727 x^5)/240+(89 x^6)/720';

function convertToJs(z, x){
  z = z.replace(/ x/g, '*x');
  z = z.replace(/x\^(\d*)/g, "Math.pow(x, $1)");
  z = z.replace(/x/g, x);
  return z;
}

// all times in ms
const REFRESHRATE = 20;
const TRIGGERVAL = 1000;
const TAPTRIGGERTIME = 500;
const IGNORETIME = 100;
const BUFFERTIME = 1000;

var rawRolling1 = Array(BUFFERTIME/REFRESHRATE).fill(1023);
var rawRolling2 = Array(BUFFERTIME/REFRESHRATE).fill(1023);

var counter = 0;
var maxCounter = 15;
var under = false;
var volumeCounter = 0;
var drag = true;

function checkTap() {
  var currentValue = rawRolling1[rawRolling1.length - 1]
  var pastValue = rawRolling1[rawRolling1.length - 2]
  console.log(currentValue, counter)
  if(currentValue > TRIGGERVAL && under === false) {
    console.log("Nothing");
    drag = false
    return; //nothing is happening
  }

  if(currentValue > TRIGGERVAL && under === true && counter < maxCounter) {
    console.log("!!!!!!!This is a click~~~~~");
    modeHandler("audio", "toggle-play");
    under = false;
    counter = 0;
    return;
  }

  if(currentValue < TRIGGERVAL && drag === true) {
    if(currentValue - pastValue < 0) {
      if(volumeCounter % 3 === 0) {
        console.log("up");
        modeHandler("audio", "volume-up");
      } else {
        volumeCounter++;
      }
    } else if(currentValue - pastValue > 0) {
      if(volumeCounter % 3 === 0) {
        console.log("down");
        modeHandler("audio", "volume-down");
      } else {
        volumeCounter++;
      }
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
port.on('data', function (data) {

  rawSerialString += data.toString('utf-8');

  if (!rawSerialString.includes(']')) {
    return;
  }

  try {
    var rawData = JSON.parse(rawSerialString);

    rawRolling1.push(rawData[0]);
    rawRolling1.shift();

    checkTap();
  } catch (e) {
    // console.log("ERROR:", rawSerialString)
    rawSerialString = '';
    //console.log('TRANSMISSION ERROR');
  }
});
