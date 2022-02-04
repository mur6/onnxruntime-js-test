import * as ort from 'onnxruntime-web';

import data from './template_params.json';

const get_float_array = (arr) => {
    return Float32Array.from(arr);
};

const to_tensor = (f32_arr, shape) => {
    return new ort.Tensor('float32', f32_arr, shape);
}

const from_3dim_to_tensor = (arr, shape) => {
    const lis = arr.flat().flat();
    const f32_arr = get_float_array(lis);
    return to_tensor(f32_arr, shape);
}

const load_input_data = (batch_imgs) => {
    const joints = data["template_3d_joints"];
    const vertices = data["template_vertices_sub"];
    const ret = {
        template_3d_joints :from_3dim_to_tensor(joints, [1, 21, 3]),
        template_vertices_sub:from_3dim_to_tensor(vertices, [1, 195, 3]),
        batch_imgs: batch_imgs
    };
    //console.log(ret);
    return ret;
}

async function get_session() {
    return ort.InferenceSession.create('./gm3.onnx');
}

// use an async context to call onnxruntime functions.
async function run(session, input_data) {
    try {
        const t0 = performance.now();
        console.log("Start prediction:");
        const results = await session.run(input_data);
        const pred_camera = results.pred_camera;
        const pred_vertices = results.pred_vertices;
        //console.log(pred_camera);
        //console.log(pred_vertices);
        const t1 = performance.now();
        console.log(`End prediction: ${t1 - t0} milliseconds.`);
        return [pred_camera, pred_vertices];
    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
        console.log(e);
    }
}

export { to_tensor, load_input_data, get_session, run };
