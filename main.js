//import {initModel} from './model.js';
import {initAll, drawFromVideo} from './video.js';

import * as model from './model.js';

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const make_render = (vertex_data) => {
    const geometry = new THREE.BufferGeometry();

    //console.log(faces_data)
    geometry.setAttribute('position', new THREE.BufferAttribute(vertex_data, 3) );
    //const uint16faces = Uint16Array.from(faces_data);
    //geometry.setIndex(new THREE.BufferAttribute(uint16faces, 1));
    const material = new THREE.MeshBasicMaterial( { color: 0x3366cc } );
    const mesh = new THREE.Mesh(geometry, material);
    const scene = new THREE.Scene();
    scene.add(mesh);

    //////////////////////////////////////////
    const renderSize = 700;
    //const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
    //camera.position.z = 1;
    //const camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    // カメラの初期座標を設定
    //camera.position.set(0, 0, 1000);
    const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 100);
    camera.position.z = 3;

    const controls = new OrbitControls(camera, document.body);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(renderSize, renderSize);
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
    tick();
    // 毎フレーム時に実行されるループイベントです
    function tick() {
        // レンダリング
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
}

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
                make_render(pred_vertices.data);
            }
        })();
    }, false);
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
