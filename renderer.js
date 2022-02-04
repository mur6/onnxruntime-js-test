
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import faces_data from './faces.json';

const get_faces = () => {
    return Uint16Array.from(faces_data.flat());
}

const make_geometry_and_mesh = () => {
    const geometry = new THREE.BufferGeometry();

    //const uint16faces = Uint16Array.from(faces_data);
    //
    const material = new THREE.MeshBasicMaterial( { color: 0x3366cc, wireframe : true} );
    const mesh = new THREE.Mesh(geometry, material);
    return [geometry, mesh];
}

const initScene = (element) => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    const renderSize = 500;
    //const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
    //camera.position.z = 1;
    //const camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    // カメラの初期座標を設定
    //camera.position.set(0, 0, 1000);
    const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 100);
    camera.position.z = 3;

    const controls = new OrbitControls(camera, element);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(renderSize, renderSize);
    renderer.render(scene, camera);
    element.appendChild(renderer.domElement);
    tick();
    // 毎フレーム時に実行されるループイベントです
    function tick() {
        // レンダリング
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }
    return scene;
}

export { get_faces, make_geometry_and_mesh, initScene };
