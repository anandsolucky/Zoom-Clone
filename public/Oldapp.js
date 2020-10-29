
console.log("app.js called");
const socket = io('/');
var peer = new Peer(undefined, {
    // path: '/peerjs',
    host: '/',
    port: '3001',
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

    socket.on('user-connected', (userid) => {
        connectToNewUser(userid, stream);
    })

    peer.on('call', call => {
        call.answer(stream)
        // const video = document.createElement('video');
        // call.on('stream', userVideoStream => {
        //     addVideoStream(video, userVideoStream);
        // })
    })

    
})

peer.on('open', userId => {
    socket.emit('join-room', ROOM_ID, userId); 
})

const connectToNewUser = (userid, stream) => {
    console.log("new user: " + userid + " connected! ");
    const call = peer.call(userid, stream);
    console.log("===================");
    console.log("call sent");
    const video = document.createElement('video');
    console.log("video tag created");
    call.on('stream', userVideoStream => {
        console.log("call on stream");
        addVideoStream(video, userVideoStream);
        console.log("video stream added");
        console.log("===============");
    })
    call.on('close', ()=> {
        video.remove();
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

