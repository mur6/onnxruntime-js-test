//import {initModel} from './model.js';

function draw() {
    // fill vertically
    var vratio = (c.height / v.videoHeight) * v.videoWidth;
    ctx.drawImage(v, 0, 0, vratio, c.height);
    // fill horizontally
    var hratio = (c.width / v.videoWidth) * v.videoHeight;
    ctx1.drawImage(v, 0, 0, c1.width, hratio);
    requestAnimationFrame(draw);
}

//     function updateCanvas() {
//     context.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
//     window.requestAnimationFrame(updateCanvas);
//   }
//   requestAnimationFrame(updateCanvas);
async function getMediaAndSetStream(video) {
    const constraints = { audio: false, video: true }
    //let stream = null;
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream
    } catch (err) {
        document.write(`failed to use getUserMedia: ${err}.`);
    }
}

async function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;

    var ctx = canvas.getContext('2d');

    //var c1 = c.cloneNode(true);
    //var ctx1 = c1.getContext('2d')

    const video = document.createElement('video');
    video.autoplay = true;
    getMediaAndSetStream(video);

    document.body.appendChild(document.createTextNode('fill vertical\n'));
    document.body.appendChild(canvas);

    document.body.appendChild(document.createTextNode('original video'));
    document.body.appendChild(video);


}

main()
