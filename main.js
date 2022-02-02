//import {initModel} from './model.js';
import {initAll, drawFromVideo} from './video.js';

import {to_tensor} from './model.js';

function main() {
    const [canvas, video] = initAll();
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('copy-to-video');
    btn.addEventListener('click', function () {
        if (canvas.width > 0 && canvas.height > 0) {
            const f32arr = drawFromVideo(ctx, video, 300, 300);
            const batch_imgs = to_tensor(f32arr, [1, 3, 224, 224]);
            console.log(batch_imgs);
        }
    }, false);
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
