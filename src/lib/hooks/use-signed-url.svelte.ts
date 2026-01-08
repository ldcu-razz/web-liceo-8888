import { getSignedUrl } from '$lib/services/files/files.service';

export function useSignedUrl(getStoragePath: () => string | undefined | null) {
	let signedUrl = $state<string>('');
	let loading = $state(true);
	let error = $state<Error | null>(null);

	$effect(() => {
		const storagePath = getStoragePath();

		if (!storagePath) {
			loading = false;
			signedUrl = '';
			return;
		}

		loading = true;
		error = null;

		getSignedUrl(storagePath)
			.then((url) => {
				signedUrl = url;
				loading = false;
			})
			.catch((err) => {
				error = err;
				loading = false;
			});
	});

	return {
		get url() {
			return signedUrl;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		}
	};
}
