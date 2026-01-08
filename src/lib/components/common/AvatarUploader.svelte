<script lang="ts" module>
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
	import { Button } from '../ui/button';

	export type Props = {
		avatar: string;
		name: string;
		fileInput?: HTMLInputElement;
		handleImageSelected?: (event: Event) => void;
		handleRemoveAvatar?: () => void;
	};
</script>

<script lang="ts">
	let {
		avatar = $bindable(''),
		name = $bindable(''),
		fileInput = $bindable(),
		handleImageSelected = () => {},
		handleRemoveAvatar = () => {}
	}: Props = $props();

	let avatarSignedUrl = useSignedUrl(() => avatar);

	let initial = $derived(`${name?.toUpperCase() ?? ''}`);

	function openImagePicker() {
		fileInput?.click();
	}
</script>

<div class="flex items-center gap-5">
	<Avatar class="size-28 border-3">
		<AvatarImage src={avatarSignedUrl.url} />
		<AvatarFallback>
			<div class="text-4xl font-bold">
				{initial}
			</div>
		</AvatarFallback>
	</Avatar>

	<div class="flex gap-2">
		<input
			accept="image/*"
			bind:this={fileInput}
			class="hidden"
			type="file"
			onchange={handleImageSelected}
		/>

		<Button variant="outline" size="sm" class="p-2 text-xs" onclick={openImagePicker}
			>Upload Picture</Button
		>
		<Button variant="outline" size="sm" class="p-2 text-xs" onclick={handleRemoveAvatar}
			>Delete Picture</Button
		>
	</div>
</div>
