<script lang="ts" module>
	import { Field, FieldGroup, FieldLabel, FieldError } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import z from 'zod';
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from '$lib/utils/form.utils';
	import { LoaderCircle, OctagonAlertIcon } from '@lucide/svelte';

	export const formSchema = z.object({
		username: z
			.string()
			.min(1, 'Username is required')
			.min(6, 'Username must be at least 6 characters')
			.regex(
				/^[a-zA-Z0-9_]+$/,
					"Username can only contain letters, numbers, and underscores (_). The '-' symbol is not allowed."
			)
	});

	export type FormData = z.infer<typeof formSchema>;

	export const initialFormData: FormData = {
		username: ''
	};

	export type Props = {
		formData?: FormData;
		errorMessage?: string;
		loading?: boolean;
		onSubmit?: (formData: FormData) => void;
		onCancel?: () => void;
	};
</script>

<script lang="ts">
	let {
		formData = $bindable(initialFormData),
		errorMessage = $bindable(''),
		loading = $bindable(false),
		onSubmit = () => {},
		onCancel = () => {}
	}: Props = $props();

	const initialFormDataValue: FormData = formData;

	let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormDataValue));

	let errors = $state<Partial<Record<keyof FormData, string>>>({});

	let invalid = $state(true);

	let isFormTouched = $derived(Object.values(touched).every((value) => value === true));

	function validateFormData() {
		const result = validateForm(formData, formSchema);
		errors = result.errors;
		invalid = result.invalid;
	}

	function validateFieldData(field: keyof FormData) {
		const result = validateField(field, formData, formSchema, errors);
		errors = result.errors;
		invalid = result.invalid;
	}

	function markTouched(field: keyof FormData) {
		touched[field] = true;
		validateFieldData(field);
	}

	function handleInputChange(field: keyof FormData, value: string) {
		formData[field] = value as never;
		if (touched[field]) {
			validateFieldData(field);
		}
	}

	function getFieldErrorMessage(field: keyof FormData): string | undefined {
		return getFieldError(field, touched, errors);
	}

	function hasFieldErrorMessage(field: keyof FormData): boolean {
		return hasFieldError(field, touched, errors);
	}

	function markAllFieldsTouchedData() {
		touched = markAllFieldsTouched(initialFormDataValue);
	}

	function handleSubmit() {
		validateFormData();
		markAllFieldsTouchedData();
		if (invalid) {
			return;
		}
		onSubmit(formData);
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	{#if errorMessage}
		<div class="mb-4 flex items-center gap-2">
			<OctagonAlertIcon class="size-4 text-red-500" />
			<span class="text-sm text-red-500">{errorMessage}</span>
		</div>
	{/if}
	<FieldGroup class="flex flex-col gap-4">
		<Field>
			<FieldLabel for="username">
				<span>Username</span>
			</FieldLabel>
			<Input
				type="text"
				id="username"
				bind:value={formData.username}
				aria-invalid={hasFieldErrorMessage('username')}
				onblur={() => markTouched('username')}
				oninput={(e) => handleInputChange('username', e.currentTarget.value)}
			/>
			{#if getFieldErrorMessage('username')}
				<FieldError errors={[{ message: getFieldErrorMessage('username') }]} />
			{/if}
		</Field>
	</FieldGroup>

	<div class="mt-6 flex justify-end gap-2">
		<Button type="button" variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
		<Button
			type="submit"
			variant="secondary"
			class="w-fit"
			disabled={(invalid && isFormTouched) || loading}
		>
			{#if loading}
				<LoaderCircle class="size-4 animate-spin" />
			{/if}
			Change Username
		</Button>
	</div>
</form>
