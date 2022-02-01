
const ort = require('onnxruntime-web');

//import data from './init_params.json';

const get_float_array = (arr) => {
    const arr2 = arr.flat();
    return Float32Array.from(arr2);
};

const to_tensor = (f32_arr, row, col) => {
    return new ort.Tensor('float32', f32_arr, [row, col]);
}

const load_input_data = () => {
    const _betas=data["betas"];
    const betas = to_tensor(get_float_array(_betas), 10, 10);
    const _pose = data["pose"];
    const pose = to_tensor(get_float_array(_pose), 10, 45);
    const _global_orient = data["global_orient"];
    const global_orient = to_tensor(get_float_array(_global_orient), 10, 3);
    const _transl = data["transl"];
    const transl = to_tensor(get_float_array(_transl), 10, 3);
    // console.log(betas);
    // console.log(pose);
    // console.log(global_orient);
    // console.log(transl);
    const d = {
        betas: betas,
        global_orient: global_orient,
        pose :pose,
        tran_s:transl,
    };
    return d;
}


// use an async context to call onnxruntime functions.
async function main() {
    try {
        const session = await ort.InferenceSession.create('./gm2.onnx');
        //const input_data = load_input_data();
        // inputs and run
        const results = await session.run(input_data);
        console.log(results);
        const vertices = results.output_vertices;
        const faces = results.output_faces;
        document.write(`vertex[dims]: ${vertices.dims}<br>`);
        document.write(`vertex[size]: ${vertices.size}<br>`);
        document.write(`faces[dims]: ${faces.dims}<br>`);
        document.write(`faces[size]: ${faces.size}<br>`);
        //console.log(vertices);
        const num = 778*3;
        console.log(num);
        const v_data = vertices.data.slice(0, num);
        make_render(v_data, faces.data);
    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
    }
}

main()
