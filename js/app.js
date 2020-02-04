if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('service-worker.js')
			.then(function (reg) {
				console.log('[ServiceWorker] Registered', reg);
			}).catch(function (error) {
				console.error('[ServiceWorker] Not registered', error);
			});
	});
}