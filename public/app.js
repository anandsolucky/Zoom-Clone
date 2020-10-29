
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
let myVideoStream;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
  myVideoStream = stream;
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })

  // message send & receive start
  let text = $('input');

  $('html').keydown((e) => {
    if(e.which == 13 && text.val().length !== 0) {
      console.log(text.val());
      socket.emit('message',text.val());
      text.val('');
    }
  })
  socket.on('create-message', message => {
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom();
  })
  // message send & receive end
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}


const scrollToBottom = () => {
  var d = $('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setUnmuteButton  = () => {
  const html = `<i class="unmute fas fa-microphone-slash"></i>
  <span>Unmute</span>`;
  document.querySelector('.main__mute__button').innerHTML = html;
}

const setMuteButton  = () => {
  const html = `<i class="fas fa-microphone"></i>
  <span>&nbsp&nbspMute</span>`;
  document.querySelector('.main__mute__button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `<i class="fas fa-video"></i>
  <span>Stop Video</span>`;
  document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `<i class="Videostopped fas fa-video-slash"></i>
  <span>Play Video</span>`;
  document.querySelector('.main__video__button').innerHTML = html;
}