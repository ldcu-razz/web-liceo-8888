<script lang="ts" module>
	import { useSignedUrl } from '$lib/hooks/use-signed-url.svelte';
	import type { string } from 'zod';
	import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
	import { Button } from '../ui/button';

	export type Props = {
		avatar: string;
		name: string;
		fileInput?: HTMLInputElement;
		avatarSize?: string;
		layoutDirection?: 'horizontal' | 'vertical';
		handleImageSelected?: (event: Event) => void;
		handleRemoveAvatar?: () => void;
	};
</script>

<script lang="ts">
	let {
		avatar = $bindable(''),
		name = $bindable(''),
		fileInput = $bindable(),
		avatarSize = 'size-28',
		layoutDirection = 'horizontal',
		handleImageSelected = () => {},
		handleRemoveAvatar = () => {}
	}: Props = $props();

	let avatarSignedUrl = useSignedUrl(() => avatar);

	let initial = $derived(`${name?.toUpperCase() ?? ''}`);

	let layoutDirectionClass = $derived(layoutDirection === 'horizontal' ? 'flex-row' : 'flex-col');

	function openImagePicker() {
		fileInput?.click();
	}
</script>

<div class={`flex items-center gap-5 ${layoutDirectionClass}`}>
	<Avatar class={`${avatarSize} border-3 bg-white`}>
		<AvatarImage src={avatarSignedUrl.url} class="object-cover" />
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
