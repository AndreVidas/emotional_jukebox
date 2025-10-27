// face detection part adapted from: https://github.com/WebDevSimplified/Face-Detection-JavaScript
// Youtube Iframe API adapted from ChatGPT prompts
const video = document.getElementById('video');
const video_test = document.getElementById('video-test');
const tag = document.createElement('script');

const start_btn = document.getElementById('start-btn');
const stop_btn = document.getElementById('stop-btn');

tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// initialize YouTube video devices
let happyVideo, surprisedVideo, sadVideo;
function onYouTubeIframeAPIReady() {
  happyVideo = new YT.Player('happyPlayer', {
    height: '168.19',
    width: '299',
    videoId: 'NzmMSxKR5GY',
    events: {
      'onReady': happyReady
    }
  });

  surprisedVideo = new YT.Player('surprisedPlayer', {
    height: '168.19',
    width: '299',
    videoId: 'mDZuNM3HmU4',
    events: {
      'onReady': surprisedReady
    }
  });

  sadVideo = new YT.Player('sadPlayer', {
    height: '168.19',
    width: '299',
    videoId: 'ZTrrc6Ni5eM',
    events: {
      'onReady': sadReady
    }
  });

  angryVideo = new YT.Player('angryPlayer', {
    height: '168.19',
    width: '299',
    videoId: 'p2NxzJ0iCLY',
    events: {
      'onReady': angryReady
    }
  });

  fearfulVideo = new YT.Player('fearfulPlayer', {
    height: '168.19',
    width: '299',
    videoId: '8_GADiwSm_M',
    events: {
      'onReady': fearfulReady
    }
  });
}

function happyReady(event) {
}
function surprisedReady(event) {
}
function sadReady(event) {
}
function angryReady(event) {
}
function fearfulReady(event) {
}


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

// initialize face detection API
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    function stopVideos(){
      happyVideo.stopVideo();
      surprisedVideo.stopVideo();
      sadVideo.stopVideo();
      angryVideo.stopVideo();
      fearfulVideo.stopVideo();
    }

    resizedDetections.forEach(result => {
      const {expressions} = result
      var happy = expressions.happy;
      var angry = expressions.angry;
      var neutral = expressions.neutral;
      var sad = expressions.sad;

      start_btn.addEventListener('click', () => {
        play = true;
      })

      stop_btn.addEventListener('click', () => {
        stopVideos();
        play = false;
      });


      // get detection label and use label for selecting video
      let max = 0;
      let maxKey = "";

      for(let expression in expressions){
        if(expressions[expression] > max){
          max = expressions[expression];
          maxKey = expression;
        }
      }
      
      if(maxKey === "neutral"){
        document.body.style.background = "grey";

      }
      if(maxKey === "happy" && play === true){
        stopVideos();
        
        document.body.style.background = "yellow";
        
        happyVideo.playVideo();

      }
      if(maxKey === "surprised" && play === true){
        stopVideos();
        
        document.body.style.background = "purple";

        surprisedVideo.playVideo();
      }
      if(maxKey === "sad" && play === true){
        stopVideos();

        document.body.style.background = "blue";
        sadVideo.playVideo();
      }
      if(maxKey === "angry" && play === true){
        stopVideos();

        document.body.style.background = "red";
        angryVideo.playVideo();
      }
      if(maxKey === "fearful" && play === true){
        stopVideos();

        document.body.style.background = "black";
        fearfulVideo.playVideo();
      }
    })
  }, 100)
})




