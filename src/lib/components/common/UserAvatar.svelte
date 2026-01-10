<script lang="ts" module>
	export type Props = {
		name: string;
		imageLink?: string;
		sizeClass?: string;
		textSizeClass?: string;
	};
</script>

<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';

	let { name, imageLink = '', sizeClass = 'size-8', textSizeClass = 'text-xs' }: Props = $props();

	// If imageLink looks like a storage path (no http), get signed URL
	const isStoragePath = $derived(!imageLink?.startsWith('http'));
	const signedUrlData = useSignedUrl(() => (isStoragePath ? imageLink : null));
	const displayUrl = $derived(isStoragePath ? signedUrlData.url : imageLink);
</script>

<Avatar class={sizeClass}>
	<AvatarImage src={displayUrl} class="object-cover" />
	<AvatarFallback class={textSizeClass}>{name.charAt(0)}</AvatarFallback>
</Avatar>
