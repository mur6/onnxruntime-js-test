const make_ones = (pyodide, a, b) => {
    const func = pyodide.globals.get('make_ones');
    return func(new Int32Array([a, b])).toJs();
}

const make_eye = (pyodide, num) => {
    const func = pyodide.globals.get('make_eye');
    return func(num).toJs();
}

async function init_pyodide() {
    const pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/"
    });
    await pyodide.loadPackage("numpy");
    await pyodide.loadPackage("micropip");
    await pyodide.loadPackage("scipy");
    await pyodide.loadPackage("scikit-learn");

    await pyodide.runPythonAsync(`
    import micropip
    await micropip.install('../wheels/trimesh-3.10.2-py3-none-any.whl')
    `);
    const code = await (await fetch("./src/perimeter_inference.py")).text()
    pyodide.runPython(code);
    return pyodide;
}

export { make_ones, make_eye, init_pyodide };
