const PlayPauseBtn = document.querySelector('.playpause');
const video = document.querySelector('#video');
const container = document.querySelector('.html5-video-player')
const volume = document.querySelector('.video_volume_button')
const noVolume = document.querySelector('.volume-muted-icon')
const fullVolume = document.querySelector('.volume-high-icon')
const lowVolume = document.querySelector('.volume-low-icon')
const range = document.querySelector('.range_container > input[type="range"]')
const theater_button = document.querySelector('.video_theater_button')
const fullscreenBtn = document.querySelector('.fullscreen')
const SettingBtn = document.querySelector('.video_setting_button')
const setting_option = document.querySelector('.setting-options')
const playbackRate = document.querySelectorAll('.PlayBack-rate')
const previewImage = document.querySelector('.preview-img')
const thumbnillImage = document.querySelector('.thumbnail-img')
const timeline = document.querySelector('.timeline')
const timelineContainer = document.querySelector('.timeline-container')
const _currentTime_ = document.querySelector('.current-time')
const _totleTime_ = document.querySelector('.total-time')
const miniplayer = document.querySelector('.video_miniplayer_button')
const captionsBtn = document.querySelector(".captions-btn")

captionsBtn.addEventListener("click", toggleCaptions)
timelineContainer.addEventListener('mousemove', timelineUpdate);
timelineContainer.addEventListener('mousedown', TpggleScrubbing);
miniplayer.addEventListener('click', pictureInpictureMode)
SettingBtn.addEventListener("click", () => { setting_option.classList.toggle('d-none') })
let scrubbing = false;
let waspause;
function TpggleScrubbing(e) {
	const rect = timelineContainer.getBoundingClientRect()
	const persent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

	scrubbing = (e.button & 1) == 1
	container.classList.toggle('scrubbing', scrubbing)

	if (scrubbing) {
		waspause = video.pause()
		video.pause()
	} else {
		video.currentTime = persent * video.duration
		if (!waspause) video.play()
	}
	timelineUpdate(e)
}
//timeline
function timelineUpdate(event) {

	const rect = timelineContainer.getBoundingClientRect()
	const persent = Math.min(Math.max(0, event.x - rect.x), rect.width) / rect.width
	const previewImageNumber = Math.max(
		1,
		Math.floor((persent * video.duration) / 10)
	)
	const previewImagesrc = `./asset/previewImage/video1/previewImage${previewImageNumber}.jpg`
	previewImage.src = previewImagesrc;
	timelineContainer.style.setProperty('--progrss', persent);
	if (scrubbing) {
		e.preventDefault()
		previewImage.src = previewImagesrc;
		timelineContainer.style.setProperty('--progrss-position', persent);
	}
}




playbackRate.forEach(options => {
	options.addEventListener('click', (event) => {
		setting_option.classList.add('d-none')
		let newPlayBackrate = (options.innerHTML == 'normal') ? 1 : options.innerHTML
		video.playbackRate = newPlayBackrate
	})
})

let display_i = document.querySelector('.display-icon')
document.addEventListener('keydown', (event) => {
	if (event.key.toLowerCase() == 'k') {
		TogglePlayPause()
	}
	if (event.key.toLowerCase() == 'm' || event.key.toLowerCase() == 'M') {
		ToggleMute()
	}
	if (event.key.toLowerCase() == 'f' || event.key.toLowerCase() == 'F') {
		FullscreenRequest()
	}
	if (event.key.toLowerCase() == 't' || event.key.toLowerCase() == 'T') {
		toggleTheaterMode()
	}
	if (event.key.toLowerCase() == 'i' || event.key.toLowerCase() == 'I') {
		pictureInpictureMode()
	}

	if (event.key.toLowerCase() == 'arrowleft' || event.key.toLowerCase() == 'j') {
		skip(-5)
	}
	if (event.key.toLowerCase() == 'arrowright' || event.key.toLowerCase() == 'l') {
		skip(5)
	}
	if (event.key.toLowerCase() == 'c') {
		toggleCaptions()
	}

	if (event.key.toLowerCase() == 'arrowup' || event.key.toLowerCase() == 'w') {
		volumeUp(event)
	}
	if (event.key.toLowerCase() == 'arrowdown' || event.key.toLowerCase() == 's') {
		volumeDown(event)
	}
})

const captions = video.textTracks[0]
captions.mode = "hidden"
function toggleCaptions() {
	const isHidden = captions.mode === "hidden"
	captions.mode = isHidden ? "showing" : "hidden"
	container.classList.toggle("captions", isHidden)
}

function skip(duration) {
	video.currentTime += duration
}

function volumeUp(event) {
	let muted_val = document.querySelector('.volume_info')
	muted_val.style.display = 'block'
	event.preventDefault();
	let audio_vol = video.volume;
	if (audio_vol != 1 || !video.muted) {
		try {
			range.value = audio_vol * 100
			video.volume = audio_vol + 0.05;
		}
		catch (err) {
			video.volume = 1;
		}

	}
	muted_val.querySelector('span').innerHTML = `${Math.trunc(audio_vol * 100)}%`;
}

function volumeDown(event) {
	let muted_val = document.querySelector('.volume_info')
	muted_val.style.display = 'block'
	event.preventDefault();
	let audio_vol = video.volume;
	if (audio_vol !=0 ) {
		try {
			video.volume = audio_vol - 0.05;
		}
		catch (err) {
			video.volume = 0;
		}
	}
	range.value = audio_vol * 100
	muted_val.querySelector('span').innerHTML = `${Math.trunc(audio_vol * 100)}%`;
}

PlayPauseBtn.addEventListener('click', (event) => {
	TogglePlayPause()
});

function TogglePlayPause() {
	video.paused ? video.play() : video.pause()
	video.paused ? PlayPauseBtn.setAttribute('title', 'Play (k)') : PlayPauseBtn.setAttribute('title', 'pause (k)')
}

video.addEventListener('play', (event) => {
	container.classList.add('play')
	container.classList.remove('paused')
})

video.addEventListener('pause', (event) => {
	container.classList.remove('play')
	container.classList.add('paused')
})

video.addEventListener('timeupdate', () => {
	const persent = (video.currentTime / video.duration)
	timelineContainer.style.setProperty('--progrss-position', persent);
})

let hrs, mins, secs;

window.setInterval(() => {
	mins = Math.floor(video.currentTime / 60);
	secs = Math.floor(video.currentTime % 60);
	if (secs < 10) {
		secs = '0' + String(secs);
	}
	_currentTime_.innerHTML = `${mins}:${secs}`
	let totle_min = Math.floor(video.duration / 60)
	let totle_sec = Math.floor(video.duration % 60);
	_totleTime_.innerHTML = `${totle_min}:${totle_sec}`
}, 1000);

range.addEventListener('input', (event) => {

	range.value == 0 ? video.muted = true : video.muted = false
	let volumeLavel;
	if (video.muted || event.target.value === 0) {
		volumeLavel = "muted"
		range.value = 0;
	} else if (event.target.value >= 60) {
		volumeLavel = "high"
	} else if (event.target.value > 0 || event.target.value < 40) {
		volumeLavel = "low"
	}
	container.dataset.volumeLevel = volumeLavel;
	setvolume()
})

volume.addEventListener('click', ToggleMute)

function setvolume() {
	video.volume = range.value / 100;
}

function ToggleMute() {
	video.muted = !video.muted
	let muted_val = document.querySelector('.volume_info')
	muted_val.style.display = 'block'
	if (video.muted) {
		muted_val.querySelector('span[value=\'\']').innerHTML = `0%`
		range.value = 0
		container.dataset.volumeLevel = "muted";
	} else {
		muted_val.querySelector('span[value=\'\']').innerHTML = `100%`
		range.value = 100
		container.dataset.volumeLevel = "heigh";
	}
}

setInterval(() => {
	let muted_val = document.querySelector('.volume_info')
	muted_val.style.display = 'none'
}, 4000)

fullscreenBtn.addEventListener('click', FullscreenRequest)
theater_button.addEventListener('click', toggleTheaterMode)


function FullscreenRequest() {
	if (document.fullscreenElement == null) {
		container.requestFullscreen()
	} else {
		document.exitFullscreen()
	}
}

function toggleTheaterMode() {
	container.classList.toggle('theater-mode')
}


function pictureInpictureMode() {
	if (container.classList.contains('miniplayer-mode')) {
		document.exitPictureInPicture()
	} else {
		video.requestPictureInPicture()
	}
}
video.addEventListener('enterpictureinpicture', () => {
	container.classList.add('miniplayer-mode')
})
video.addEventListener('leavepictureinpicture', () => {
	container.classList.remove('miniplayer-mode')
})
document.addEventListener("fullscreenchange", () => {
	container.classList.toggle('fullscreen', document.fullscreenElement)
})

