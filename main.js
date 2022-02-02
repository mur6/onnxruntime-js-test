import {initAll, drawFromVideo} from './video.js';
import * as model from './model.js';
import * as renderer from './renderer.js';

function main() {
    const [canvas, video] = initAll();
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('copy-to-video');
    btn.addEventListener('click', function () {
        (async () => {
            if (canvas.width > 0 && canvas.height > 0) {
                const f32arr = drawFromVideo(ctx, video, 300, 300);
                const batch_imgs = model.to_tensor(f32arr, [3, 224, 224]);
                console.log(batch_imgs);
                const input = model.load_input_data(batch_imgs);
                const [pred_camera, pred_vertices] = await model.run(input);
                renderer.make_render(pred_vertices.data);
            }
        })();
    }, false);
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
