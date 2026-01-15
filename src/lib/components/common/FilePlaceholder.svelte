<script lang="ts" module>
	import type { GetFile } from '$lib/models/files/files.type';
	import type { FileTypes } from '$lib/models/files/files.type';
	export type Props = {
		file: File | GetFile;
		onRemove?: () => void;
	};
</script>

<script lang="ts">
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

	let { file, onRemove }: Props = $props();
	let selectedFile = $state<File | GetFile | null>(null);
	let isViewFileOpen = $state(false);

	const isGetFile = (f: File | GetFile): f is GetFile => {
		return 'type' in f && 'path' in f;
	};

	const signedUrlResult = useSignedUrl(() => (isGetFile(file) ? file.path : null));

	const getFileType = (f: File | GetFile): FileTypes => {
		if (isGetFile(f)) {
			return f.type;
		}
		const mimeType = f.type;
		if (mimeType.startsWith('image/')) return 'image';
		if (mimeType.startsWith('video/')) return 'video';
		if (mimeType.startsWith('audio/')) return 'audio';
		if (mimeType === 'application/pdf') return 'pdf';
		if (mimeType.includes('word') || mimeType.includes('msword')) return 'word';
		if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'excel';
		if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'powerpoint';
		if (mimeType.includes('document')) return 'document';
		return 'other';
	};

	const fileType = $derived(getFileType(file));
	const fileUrl = $derived(isGetFile(file) ? signedUrlResult.url : URL.createObjectURL(file));
	const isImage = $derived(fileType === 'image');
	const isVideo = $derived(fileType === 'video');
	const fileExtension = $derived(
		isGetFile(file)
			? file.extension.toUpperCase()
			: file.name.split('.').pop()?.toUpperCase() || 'File'
	);

	const fileName = $derived(isGetFile(file) ? (file.name ?? 'File') : file.name);

	const fileSize = $derived(file.size);

	const getFileTypeStyles = (type: FileTypes) => {
		switch (type) {
			case 'pdf':
				return { bg: 'bg-red-500', icon: 'PDF' };
			case 'word':
				return { bg: 'bg-blue-600', icon: 'DOC' };
			case 'excel':
				return { bg: 'bg-green-600', icon: 'XLS' };
			case 'powerpoint':
				return { bg: 'bg-orange-500', icon: 'PPT' };
			case 'document':
				return { bg: 'bg-gray-600', icon: 'DOC' };
			case 'audio':
				return { bg: 'bg-purple-500', icon: 'AUDIO' };
			default:
				return { bg: 'bg-blue-500', icon: fileExtension };
		}
	};

	const typeStyles = $derived(getFileTypeStyles(fileType));

	$effect(() => {
		if (!isGetFile(file)) {
			const url = fileUrl;
			return () => {
				URL.revokeObjectURL(url);
			};
		}
	});
</script>

<div
	class="group relative h-full w-full cursor-pointer overflow-hidden rounded-md border border-gray-300 bg-gray-100"
>
	{#if onRemove}
		<button
			onclick={onRemove}
			class="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600"
			aria-label="Remove file"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>
	{/if}

	{#if isGetFile(file) && signedUrlResult.loading}
		<div class="flex h-32 w-32 items-center justify-center">
			<LoaderCircle class="size-4 animate-spin" />
		</div>
	{:else if isGetFile(file) && signedUrlResult.error}
		<div class="flex h-32 items-center justify-center p-4">
			<p class="text-center text-sm text-red-600">Failed to load file</p>
		</div>
	{:else if isImage}
		<button
			type="button"
			class="h-full w-full text-left"
			onclick={() => {
				selectedFile = file;
				isViewFileOpen = true;
			}}
		>
			<div class="aspect-video h-full w-full">
				<img src={fileUrl} alt={fileName} class="h-full w-full object-cover" />
			</div>
			<div class="border-t border-gray-200 bg-white p-2">
				<p class="truncate text-sm text-gray-700" title={fileName}>
					{fileName}
				</p>
			</div>
		</button>
	{:else if isVideo}
		<button
			type="button"
			class="h-full w-full text-left"
			onclick={() => {
				selectedFile = file;
				isViewFileOpen = true;
			}}
		>
			<div class="aspect-video h-full w-full">
				<video src={fileUrl} controls class="h-full w-full object-cover">
					<track kind="captions" />
					Your browser does not support the video tag.
				</video>
			</div>
			<div class="border-t border-gray-200 bg-white p-2">
				<p class="truncate text-sm text-gray-700" title={fileName}>
					{fileName}
				</p>
			</div>
		</button>
	{:else if fileType === 'audio'}
		<button
			type="button"
			class="h-full w-full p-4 text-left"
			onclick={() => {
				selectedFile = file;
				isViewFileOpen = true;
			}}
		>
			<div class="flex items-center gap-4">
				<div class="size-32 shrink-0 {typeStyles.bg} flex items-center justify-center rounded-lg">
					<span class="text-xs font-bold text-white">{typeStyles.icon}</span>
				</div>
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-gray-900" title={fileName}>
						{fileName}
					</p>
					<p class="text-xs text-gray-500">
						{(fileSize / 1024).toFixed(2)} KB
					</p>
				</div>
			</div>
			<audio src={fileUrl} controls class="mt-3 w-full">
				Your browser does not support the audio tag.
			</audio>
		</button>
	{:else}
		<button
			type="button"
			class="h-full w-full text-left"
			onclick={() => {
				if (fileUrl) {
					window.open(fileUrl, '_blank');
				}
			}}
		>
			<div class="flex h-full max-w-62 items-center gap-4 p-2">
				<div class="shrink-0 px-3 py-2 {typeStyles.bg} flex items-center justify-center rounded-lg">
					<span class="text-center text-xs font-bold text-white">{typeStyles.icon}</span>
				</div>
				<div class="min-w-0 flex-1 shrink-0">
					<p class="truncate text-sm font-medium text-gray-900" title={fileName}>
						{fileName}
					</p>
					<p class="text-xs text-gray-500">
						{(fileSize / 1024).toFixed(2)} KB
					</p>
				</div>
			</div>
		</button>
	{/if}
</div>

<Dialog bind:open={isViewFileOpen}>
	<DialogContent class="sm:max-w-5xl">
		<DialogHeader>
			<DialogTitle>
				{selectedFile
					? isGetFile(selectedFile)
						? (selectedFile.name ?? 'File')
						: selectedFile.name
					: 'File Preview'}
			</DialogTitle>
		</DialogHeader>

		{#if selectedFile}
			{#if isImage}
				<div class="aspect-video w-full">
					<img src={fileUrl} alt={fileName} class="h-full w-full object-contain" />
				</div>
			{:else if isVideo}
				<div class="aspect-video w-full">
					<video src={fileUrl} controls class="h-full w-full object-contain">
						<track kind="captions" />
						Your browser does not support the video tag.
					</video>
				</div>
			{:else if fileType === 'audio'}
				<div class="w-full p-4">
					<audio src={fileUrl} controls class="w-full">
						Your browser does not support the audio tag.
					</audio>
				</div>
			{/if}
		{/if}
	</DialogContent>
</Dialog>
