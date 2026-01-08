<script lang="ts" module>
	export type Props = {
		name: string;
		imageLink?: string;
		sizeClass?: string;
	};
</script>

<script lang="ts">
	import { Avatar, AvatarImage, AvatarFallback } from '$lib/components/ui/avatar';
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';

	let {
		name,
		imageLink = 'https://github.com/evilrabbit.png',
		sizeClass = 'size-8'
	}: Props = $props();

	// If imageLink looks like a storage path (no http), get signed URL
	const isStoragePath = $derived(!imageLink?.startsWith('http'));
	const signedUrlData = useSignedUrl(() => (isStoragePath ? imageLink : null));
	const displayUrl = $derived(isStoragePath ? signedUrlData.url : imageLink);
</script>

<Avatar class={sizeClass}>
	<AvatarImage src={displayUrl} class="object-cover" />
	<AvatarFallback>{name.charAt(0)}</AvatarFallback>
</Avatar>
