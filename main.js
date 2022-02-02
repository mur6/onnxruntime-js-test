//import {initModel} from './model.js';

function resize() {
    // fill vertically
    var vratio = (c.height / v.videoHeight) * v.videoWidth;
    ctx.drawImage(v, 0, 0, vratio, c.height);
    // fill horizontally
    var hratio = (c.width / v.videoWidth) * v.videoHeight;
    ctx1.drawImage(v, 0, 0, c1.width, hratio);
    requestAnimationFrame(draw);
}

async function getMediaAndSetStream(video) {
    const constraints = { audio: false, video: { width: 1280, height: 720 } }
    //let stream = null;
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream
    } catch (err) {
        document.write(`failed to use getUserMedia: ${err}.`);
    }
}

const CANVAS_SIZE = {width: 224, height: 224};

const drawFromVideo = (ctx, video) => {
    const width = 450;//CANVAS_SIZE.width;
    const height = 450;//CANVAS_SIZE.height;
    const marginX = Math.floor((1280 - width) / 2);
    const marginY = Math.floor((720 - height) / 2);
    //console.log(marginX, marginY);

    ctx.drawImage(video, marginX, marginY, width, height, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    const imageData = ctx.getImageData(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    console.log(imageData);
    //const rgb = Array.from({length: 10}, (_, _) => {3});
    const rgb = [new Float32Array(224 * 224), new Float32Array(224 * 224), new Float32Array(224 * 224)];
    for(j = 0; j < (imageData.data.length / 4); j++) {
        rgb[0][j] = imgData.data[j * 4 + 0]
        rgb[1][j] = imgData.data[j * 4 + 1]
        rgb[2][j] = imgData.data[j * 4 + 2]
    }

}

async function main() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

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
    btn.addEventListener('click', function () {
        if (canvas.width > 0 && canvas.height > 0) {
            drawFromVideo(ctx, video, 300, 300);
        }
    }, false);
}



document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
