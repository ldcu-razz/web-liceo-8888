import { API_FILES_SIGNED_URL, API_FILES_UPLOAD } from '$lib/constants/routes.constants';
import type { FileTypes, GetFile, PostFile } from '$lib/models/files/files.type';
import { requestFetch } from '../request/request.service';

export const uploadFile = async (payload: PostFile): Promise<GetFile> => {
	try {
		const formData = new FormData();
		formData.append('file', payload.file);
		// if (payload.user_id) {
		formData.append('user_id', payload.user_id ?? '');
		// }
		// if (payload.ticket_id) {
		formData.append('ticket_id', payload.ticket_id ?? '');
		// }
		// if (payload.department_id) {
		formData.append('department_id', payload.department_id ?? '');
		// }

		const response = await requestFetch(API_FILES_UPLOAD, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error);
		}
		return response.json();
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
};

// Cache for signed URLs with expiration
const urlCache = new Map<string, { url: string; expiresAt: number }>();

export const getSignedUrl = async (storagePath: string): Promise<string> => {
	// Check cache first
	const cached = urlCache.get(storagePath);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.url;
	}

	try {
		const response = await requestFetch(API_FILES_SIGNED_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ path: storagePath })
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error);
		}

		const { signedUrl, expiresAt } = await response.json();

		// Cache the URL (expires 5 minutes before actual expiration for safety)
		urlCache.set(storagePath, {
			url: signedUrl,
			expiresAt: new Date(expiresAt).getTime() - 5 * 60 * 1000
		});

		return signedUrl;
	} catch (error) {
		console.error(error);
		throw new Error((error as Error).message);
	}
};

export const detectFileType = (mime: string, ext: string): FileTypes => {
	const lowerMime = mime.toLowerCase();
	const lowerExt = ext.toLowerCase();

	if (lowerMime.startsWith('image/')) return 'image';
	if (lowerMime.startsWith('video/')) return 'video';
	if (lowerMime.startsWith('audio/')) return 'audio';
	if (lowerMime === 'application/pdf' || lowerExt === 'pdf') return 'pdf';
	if (['xlsx', 'xls', 'csv'].includes(lowerExt)) return 'excel';
	if (['ppt', 'pptx', 'pps'].includes(lowerExt)) return 'powerpoint';
	if (['doc', 'docx', 'odt', 'rtf'].includes(lowerExt)) return 'word';

	// Generic document bucket for common office/text formats
	if (lowerMime.startsWith('text/') || ['txt', 'md'].includes(lowerExt)) return 'document';

	return 'other';
};
