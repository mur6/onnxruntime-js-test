# onnxruntime
## Usage

1. install dependencies:
   ```sh
   npm install
   ```

2. use webpack to make bundle:
   ```sh
   npx webpack
   ```
   this generates the bundle file `./dist/bundle.min.js`

3. use NPM package `light-server` to serve the current folder at http://localhost:8080/
   ```sh
   npx light-server -s . -p 8080
   ```

4. open your browser and navigate to the URL.
