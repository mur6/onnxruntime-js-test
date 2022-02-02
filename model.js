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
    console.log(ret);
    return ret;
}

// use an async context to call onnxruntime functions.
async function run(input_data) {
    try {
        const session = await ort.InferenceSession.create('./gm3.onnx');
        const results = await session.run(input_data);
        //console.log(results);
        const pred_camera = results.pred_camera;
        const pred_vertices = results.pred_vertices;
        //console.log(pred_camera);
        //console.log(pred_vertices);
        return [pred_camera, pred_vertices];
    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
        console.log(e);
    }
}

export { to_tensor, load_input_data, run };
