//import {initModel} from './model.js';
import {initVideo} from './video.js';

async function main() {
    initVideo();
}

document.addEventListener('DOMContentLoaded', (event) => {
    main();
})
