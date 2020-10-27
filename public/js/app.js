console.log("app.js called");
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid);
const videoElement = document.createElement('video');
videoElement.muted = true;

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(videoElement, stream);
    
})

const addVideoStream = (videoElement, stream) => {
    videoElement.srcObject = stream;
    videoElement.addEventListener('loadedmetadata', ()=> {
        console.log("event listener called");
        videoElement.play();
    })
    videoGrid.append(videoElement);
}

