module.exports = {
	modeHandler: modeHandler
}

const robot = require('robotjs');

function modeHandler(mode, action) {
	switch (mode) {
		case 'audio':
			audioHandler(action);
			break;
		case 'video':
			console.log('Video');
			break;
		case 'game':
			arrowsHandler(action);
			break;
		default:
			console.error('Unhandled mode case');
	}
}

function arrowsHandler(action) {
	switch (action) {
		case 'flick-up':
			robot.keyTap('up');
			break;
		case 'flick-down':
			robot.keyTap('down');
			break;
		case 'flick-left':
			robot.keyTap('left');
			break;
		case 'flick-right':
			robot.keyTap('right');
			break;
		default:
			console.error('Unhandled arrow action');
	}
}

function audioHandler(action){
	switch (action) {
		case 'tap': // Toggle playing of music
			toggleAudio();
			break;
		case 'flick-right':
			robot.keyTap('audio_next');
			break;
		case 'flick-left':
			robot.keyTap('audio_prev');
			break;
		case 'slide-up':
			robot.keyTap('audio_vol_up');
			break;
		case 'slide-down':
			robot.keyTap('audio_vol_down');
			break;
		default:
			console.error('Unhandled audio action');
	}
}

function toggleAudio() {
	return robot.keyTap('audio_pause');
}

