
const ort = require('onnxruntime-web');

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

//template_3d_joints: torch.Size([1, 21, 3]) torch.float32
//template_vertices_sub: torch.Size([1, 195, 3]) torch.float32

const load_input_data = () => {
    const joints = data["template_3d_joints"];
    //const betas = from_3dim_to_tensor(d, [1, 21, 3]);
    const vertices = data["template_vertices_sub"];
    const ret = {
        template_3d_joints :from_3dim_to_tensor(joints, [1, 21, 3]),
        template_vertices_sub:from_3dim_to_tensor(vertices, [1, 195, 3]),
    };
    console.log(ret);
    return ret;
}


// use an async context to call onnxruntime functions.
async function main() {
    try {
        const session = await ort.InferenceSession.create('./gm2.onnx');
        const input_data = load_input_data();
        const results = await session.run(input_data);
        //console.log(results);
        const pred_camera = results.pred_camera;
        const pred_vertices = results.pred_vertices;
        console.log(pred_camera);
        //pred_camera, pred_3d_joints, pred_vertices_sub, pred_vertices
        // document.write(`vertex[dims]: ${vertices.dims}<br>`);
        // document.write(`vertex[size]: ${vertices.size}<br>`);
        // document.write(`faces[dims]: ${faces.dims}<br>`);
        // document.write(`faces[size]: ${faces.size}<br>`);
        // //console.log(vertices);
        // const num = 778*3;
        // console.log(num);
        // const v_data = vertices.data.slice(0, num);
        // make_render(v_data, faces.data);
    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
    }
}

main()
