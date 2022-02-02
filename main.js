import {initAll, drawFromVideo} from './video.js';
import * as model from './model.js';
import * as renderer from './renderer.js';
import * as THREE from 'three';

function main() {
    const [canvas, video] = initAll();
    const ctx = canvas.getContext('2d');
    const btn = document.getElementById('copy-to-video');
    const btn2 = document.getElementById('predict-hand');
    const scene = renderer.initScene(document.getElementById("threejs"));
    const [geometry, mesh] = renderer.make_geometry_and_mesh();
    scene.add(mesh);
    const update = (pred_vertices) => {
        const v = pred_vertices.data;
        geometry.setAttribute('position', new THREE.BufferAttribute(v, 3));
        geometry.attributes.position.needsUpdate = true;
    }
    btn.addEventListener('click', function () {
        (async () => {
            if (canvas.width > 0 && canvas.height > 0) {
                const f32arr = drawFromVideo(ctx, video, 300, 300);
                const batch_imgs = model.to_tensor(f32arr, [3, 224, 224]);
                console.log(batch_imgs);
                const input = model.load_input_data(batch_imgs);
                const [pred_camera, pred_vertices] = await model.run(input);

                update(pred_vertices);
            }
        })();
    }, false);
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
