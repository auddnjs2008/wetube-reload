const video = document.querySelector('video');
const playBtn = document.getElementById('play');
const muteBtn = document.getElementById('mute');
const time = document.getElementById('time');
const volume = document.getElementById('volume');

const handlePlayClick = (e) => {
    if(video.paused){
        playBtn.innerText = 'Pause';
        video.play();
    }else{
        video.pause();
    }
}

const handleMute = (e) => {

}

const handlePause = () => {
    playBtn.innerText = 'Play';
}

const handlePlay = () => {
    playBtn.innerText = 'Pause';
}

playBtn.addEventListener('click',handlePlayClick);
muteBtn.addEventListener('click',handleMute);
video.addEventListener('pause',handlePause);
video.addEventListener('play',handlePlay);