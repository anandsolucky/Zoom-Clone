
console.log("app.js called");
const socket = io("/");
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
}); 

const videoGrid = document.getElementById('video-grid');
const videoElement = document.createElement('video');
videoElement.muted = true;



let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(videoElement, stream);


    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    })
    socket.on('user-connected', (userid) => {
        connectToNewUser(userid, stream);
    })
    
})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userid, stream) => {
    console.log("new user: " + userid + " connected! ");
    const call = peer.call(userid, stream);
    const video = document.createElement('video');
    call.on('stream', myVideoStream => {
        addVideoStream(video, myVideoStream);
    })
}


const addVideoStream = (videoElement, stream) => {
    videoElement.srcObject = stream;
    videoElement.addEventListener('loadedmetadata', ()=> {
        console.log("event listener called");
        videoElement.play();
    })
    videoGrid.append(videoElement);
}

