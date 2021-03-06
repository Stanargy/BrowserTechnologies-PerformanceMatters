class hand {
    constructor(positionA, positionB, positionC, positionD) {

        this.positionA = positionA
        this.positionB = positionB
        this.positionC = positionC
        this.positionD = positionD
    }
}

function wrapperFunction() {
    return new Promise(resolve => {
        const video = document.getElementById("myvideo");
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        let trackButton = document.getElementById("i-button");
        let updateNote = document.getElementById("updatenote");
        trackButton.addEventListener('click', ()=>{
            toggleVideo();
            
        });
        let isVideo = false;
        let model = null;


        const modelParams = {
            flipHorizontal: true, // flip e.g for video  
            maxNumBoxes: 1, // maximum number of boxes to detect
            iouThreshold: 0.5, // ioU threshold for non-max suppression
            scoreThreshold: 0.6, // confidence threshold for predictions.
        }

        function startVideo() {
            handTrack.startVideo(video).then(function (status) {
                console.log("video started", status);
                if (status) {
                    updateNote.innerText = "Video started. Now tracking"
                    isVideo = true
                    setTimeout(() => {
                updateNote.innerText = "Move your hand in front of the screen to interact"
            }, 1000)
                    runDetection()
                } else {
                    updateNote.innerText = "Please enable video"
                }
            });
        }

        function toggleVideo() {
            if (!isVideo) {
                updateNote.innerText = "Starting video"
                startVideo();
            } else {
                updateNote.innerText = "Stopping video"
                handTrack.stopVideo(video)
                isVideo = false;
                updateNote.innerText = "Video stopped"
            }
        }



        function runDetection() {
            model.detect(video).then(predictions => {
                if (predictions.length != 0) {
                    var myhand = new hand(predictions[0].bbox[0], predictions[0].bbox[1], predictions[0].bbox[2], predictions[0].bbox[3])

                    setTimeout(() => {
                        // console.log(myhand);
                    }, 10)
                }

                model.renderPredictions(predictions, canvas, context, video);
                if (isVideo) {
                    requestAnimationFrame(runDetection);
                }
            });
        }

        // Load the model.
        handTrack.load(modelParams).then(lmodel => {
            // detect objects in the image.
            model = lmodel
            updateNote.innerText = "Model Loaded"
            console.log('Model Loaded')
            
            trackButton.disabled = false
            resolve('resolved');
        });
    });
};

async function asyncCall() {
    console.log('Loading model Async')
    await wrapperFunction();
}

asyncCall();