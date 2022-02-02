
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import faces from './faces.json';

const make_geometry_and_mesh = () => {
    const geometry = new THREE.BufferGeometry();

    //const uint16faces = Uint16Array.from(faces_data);
    //geometry.setIndex(new THREE.BufferAttribute(uint16faces, 1));
    const material = new THREE.MeshBasicMaterial( { color: 0x3366cc } );
    const mesh = new THREE.Mesh(geometry, material);
    return [geometry, mesh];
}

const initScene = (element) => {
    const scene = new THREE.Scene();
    const renderSize = 700;
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

export { make_geometry_and_mesh, initScene };
