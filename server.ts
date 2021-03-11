 const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");
const httpserver = require('http').createServer(app); //app is an http server
const io = require('socket.io')(httpserver) ;

const port = process.env.PORT || 5001;


let senderStream;


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};




app.get('/', (req, res) => {
    res.sendFile('client/src/app/modules/eshop/live/live.componenent.html');
});


io.on('connection', (socket)=>{
    // callback function after connection is made to the client

    // recieves a chat event, then sends the data to other sockets
    socket.on('chat', (data)=>{
        io.sockets.emit('chat', data)

        socket.on('userTyping',(data)=>{
            socket.broadcast.emit('userTyping',data)
        })
    });


});
// http server listening on port
httpserver.listen(port, function(){
    console.log('listening on *:5001');
  });

 