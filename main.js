import {initAll, drawFromVideo, contextToRgbArray} from './video.js';
import * as model from './model.js';
import * as renderer from './renderer.js';
import * as THREE from 'three';

async function main() {
    const [canvas, video] = initAll();
    const ctx = canvas.getContext('2d');
    const copy_to_video_button = document.getElementById('copy-to-video');
    const predict_hand_button = document.getElementById('predict-hand');
    const [scene, camera] = renderer.initScene(document.getElementById("threejs"));
    const [geometry, mesh] = renderer.make_geometry_and_mesh();
    const uint16faces = renderer.get_faces();

    const update = (pred_vertices) => {
        const v = pred_vertices.data;
        geometry.setAttribute('position', new THREE.BufferAttribute(v, 3));
        geometry.setIndex(new THREE.BufferAttribute(uint16faces, 1));
        geometry.attributes.position.needsUpdate = true;
        scene.add(mesh);
        const blob = renderer.mesh_save(scene);
        const elm = document.createElement("a");
        elm.href = window.URL.createObjectURL(blob);
        elm.innerHTML = "dl";
        document.body.appendChild(elm);
        console.log(camera.position);
    }
    let batch_imgs = null;
    const session = await model.get_session();
    console.log(`session loaded: ${session}`);
    (async () => {
        batch_imgs = model.to_tensor(contextToRgbArray(ctx), [3, 224, 224]);
        const input = model.load_input_data(batch_imgs);
        const [pred_vertices, pred_3d_joints] = await model.run(session, input);
        update(pred_vertices);
    })();
    copy_to_video_button.addEventListener('click', function () {
        (async () => {
            if (canvas.width > 0 && canvas.height > 0) {
                const f32arr = drawFromVideo(ctx, video, 300, 300);
                batch_imgs = model.to_tensor(f32arr, [3, 224, 224]);
                console.log(`copy_to_video: converted batch_imgs: ${batch_imgs}`);
            }
        })();
    }, false);
    predict_hand_button.addEventListener('click', function () {
        (async () => {
                const input = model.load_input_data(batch_imgs);
                const [pred_vertices, pred_3d_joints] = await model.run(session, input);
                update(pred_vertices);
        })();
    }, false);
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
