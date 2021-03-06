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
        // document.write(`failed to use getUserMedia: ${err}.`);
        console.log(err);
    }
}

const CANVAS_SIZE = { width: 224, height: 224 };

const drawFromVideo = (ctx, video) => {
    const width = 450;//CANVAS_SIZE.width;
    const height = 450;//CANVAS_SIZE.height;
    const marginX = Math.floor((1280 - width) / 2);
    const marginY = Math.floor((720 - height) / 2);
    //console.log(marginX, marginY);

    ctx.drawImage(video, marginX, marginY, width, height, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    return contextToRgbArray(ctx);
}

const contextToRgbArray = (context) => {
    const imageData = context.getImageData(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    const channel_size = 224 * 224;
    const rgb = new Float32Array(channel_size * 3);
    for (let j = 0; j < (imageData.data.length / 4); j++) {
        rgb[channel_size * 0 + j] = imageData.data[j * 4 + 0] / 255.0;
        rgb[channel_size * 1 + j] = imageData.data[j * 4 + 1] / 255.0;
        rgb[channel_size * 2 + j] = imageData.data[j * 4 + 2] / 255.0;
    }
    return rgb;
}

function initAll() {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;
    const context = canvas.getContext('2d');
    const initial_image = new Image();
    initial_image.src = "./images/right_hand.png";
    initial_image.onload = () => {
        context.drawImage(initial_image, 0, 0, 448, 448, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
    };

    const video = document.createElement('video');
    video.autoplay = true;
    //video.style.visibility ="hidden";
    getMediaAndSetStream(video);
    const container = document.getElementById("container");
    //console.log(container);
    container.appendChild(document.createTextNode('canvas:\n'));
    container.appendChild(canvas);

    container.appendChild(document.createTextNode('original video'));
    container.appendChild(video);

    return [canvas, video];
}

export { drawFromVideo, initAll, contextToRgbArray};
