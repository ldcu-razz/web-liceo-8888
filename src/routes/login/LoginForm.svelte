<script lang="ts" module>
	interface Props {
		onLogin?: (formData: FormData) => void;
		onForgotPassword?: () => void;
		onSignUp?: () => void;
	}

	type FormData = {
		username: string;
		password: string;
	};
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import FieldGroup from '$lib/components/ui/field/field-group.svelte';
	import FieldLabel from '$lib/components/ui/field/field-label.svelte';
	import FieldSeparator from '$lib/components/ui/field/field-separator.svelte';
	import Field from '$lib/components/ui/field/field.svelte';
	import { InputGroupInput } from '$lib/components/ui/input-group';
	import InputGroupAddon from '$lib/components/ui/input-group/input-group-addon.svelte';
	import InputGroup from '$lib/components/ui/input-group/input-group.svelte';
	import { LockIcon, UserIcon } from '@lucide/svelte';

	let { onLogin = () => {}, onForgotPassword = () => {}, onSignUp = () => {} }: Props = $props();

	let formData = $state<FormData>({
		username: '',
		password: ''
	});
</script>

<form class="flex flex-col gap-5">
	<FieldGroup>
		<Field class="flex flex-col gap-2">
			<FieldLabel for="username">Username</FieldLabel>
			<InputGroup>
				<InputGroupInput bind:value={formData.username} type="text" id="username" />
				<InputGroupAddon>
					<UserIcon class="size-4" />
				</InputGroupAddon>
			</InputGroup>
		</Field>

		<Field class="flex flex-col gap-2">
			<FieldLabel for="password" class="flex justify-between">
				<span>Password</span>
				<Button variant="link" class="h-2 p-0 font-normal text-black" onclick={onForgotPassword}>
					Forgot password?
				</Button>
			</FieldLabel>
			<InputGroup>
				<InputGroupInput bind:value={formData.password} type="password" id="password" />
				<InputGroupAddon>
					<LockIcon class="size-4" />
				</InputGroupAddon>
			</InputGroup>
		</Field>

		<Field>
			<Button type="submit" variant="secondary" class="w-full" onclick={() => onLogin(formData)}>
        Login
      </Button>
		</Field>

		<FieldSeparator>Or create an account</FieldSeparator>

		<Field>
			<Button class="bg-black text-white" onclick={onSignUp}>Sign up</Button>
		</Field>
	</FieldGroup>

	<div class="flex flex-col gap-2"></div>
</form>
