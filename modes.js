module.exports = {
	modeHandler: modeHandler
}

const robot = require('robotjs');

function modeHandler(mode, action) {
	switch (mode) {
		case 'audio':
			audioHandler(action)
			break;
		case 'video':
			console.log('Video')
			break;
		default:
			console.error('Unhandled mode case');
	}
}

function audioHandler(action){
	switch (action) {
		case 'toggle-play':
			toggleAudio();
			break;
		case 'next':
			robot.keyTap('audio_next');
			break;
		case 'prev':
			robot.keyTap('audio_prev');
			break;
		case 'volume-up':
			robot.keyTap('audio_vol_up');
			break;
		case 'volume-down':
			robot.keyTap('audio_vol_down');
			break;
		default:
			console.error('Unhandled audio action')
	}
}

function toggleAudio() {
	return robot.keyTap('audio_pause')
}

