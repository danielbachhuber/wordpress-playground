import { registerServiceWorker, createWordPressWorker, getWorkerBackend } from './library';
import { wordPressSiteUrl, serviceWorkerUrl, wasmWorkerUrl, wasmWorkerBackend } from './config';

async function init() {
	console.log("[Main] Initializing the workers")
	
	const wasmWorker = await createWordPressWorker(
		{
			backend: getWorkerBackend( wasmWorkerBackend, wasmWorkerUrl ),
			wordPressSiteUrl: wordPressSiteUrl
		}
	);
	await registerServiceWorker(
		serviceWorkerUrl,
		// Forward any HTTP requests to a worker to resolve them in another process.
		// This way they won't slow down the UI interactions.
		async (request) => {
			return await wasmWorker.HTTPRequest(request);
		}
	);
    console.log("[Main] Workers are ready")

	document.querySelector('#wp').src = '/wp-login.php';
}
init();