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
const drawCanvas = (canvas, ctx, video, width, height) => {
    if (canvas.width > 0 && canvas.height > 0) {
        ctx.drawImage(video, 0, 0, width, height, 0, 0, 300, 300);
    }
}
async function main() {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;

    var ctx = canvas.getContext('2d');

    //var c1 = c.cloneNode(true);
    //var ctx1 = c1.getContext('2d')

    const video = document.createElement('video');
    video.autoplay = true;
    getMediaAndSetStream(video);
    const container = document.getElementById("container");
    console.log(container);
    container.appendChild(document.createTextNode('fill vertical\n'));
    container.appendChild(canvas);

    

    container.appendChild(document.createTextNode('original video'));
    container.appendChild(video);

    const btn = document.getElementById('copy-to-video');
    btn.addEventListener('click', function() {
        drawCanvas(canvas, ctx, video, 300, 300);
    }, false);
}



document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
