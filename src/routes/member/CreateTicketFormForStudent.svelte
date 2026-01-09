<script lang="ts" module>
	import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { ticketCategoriesNonArchivedStore } from '$lib/store/ticket-categories.store';
	import { LoaderCircle } from '@lucide/svelte';
	import { z } from 'zod';
	import {
		validateForm,
		validateField,
		getFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from '$lib/utils/form.utils';

	export const formSchema = z.object({
		title: z.string().min(1, 'Title is required'),
		category_id: z.string(),
		description: z.string().min(1, 'Description is required')
	});

	export type FormData = z.infer<typeof formSchema>;

	export const initialFormData: FormData = {
		title: '',
		category_id: '',
		description: ''
	};

	export type Props = {
		formData?: FormData;
		loading?: boolean;
		invalid?: boolean;
		onSubmit?: (formData: FormData) => void;
		onCancel?: () => void;
	};
</script>

<script lang="ts">
	let {
		formData = $bindable(initialFormData),
		loading = $bindable(false),
		invalid = $bindable(false),
		onSubmit = () => {},
		onCancel = () => {}
	}: Props = $props();

	let categories = $derived($ticketCategoriesNonArchivedStore);

	let selectedCategory = $derived(
		categories.find((category) => category.id === formData.category_id)
	);

	let errors = $state<Partial<Record<keyof FormData, string>>>({});
	let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));
	let isFormTouched = $derived(Object.values(touched).some((value) => value === true));

	$effect(() => {
		invalid = validateForm(formData, formSchema).invalid;
	});

	function handleFieldBlur(field: keyof FormData) {
		touched[field] = true;
		const validation = validateField(field, formData, formSchema, errors);
		errors = validation.errors;
	}

	function handleOnCancelClick() {
		formData = { ...initialFormData };
		errors = {};
		touched = createInitialTouched(initialFormData);
		onCancel?.();
	}

	function handleSubmit() {
		touched = markAllFieldsTouched(formData);

		const validation = validateForm(formData, formSchema);
		errors = validation.errors;

		if (!validation.invalid) {
			onSubmit?.(formData);
		}
	}
</script>

<form>
	<FieldGroup>
		<Field>
			<FieldLabel class="gap-1">Title <span class="text-red-500">*</span></FieldLabel>
			<Input
				type="text"
				bind:value={formData.title}
				onblur={() => handleFieldBlur('title')}
				class={getFieldError('title', touched, errors)
					? 'border-red-500! focus-visible:ring-red-300'
					: ''}
			/>
			{#if getFieldError('title', touched, errors)}
				<p class="mt-1 text-sm text-red-500">{getFieldError('title', touched, errors)}</p>
			{/if}
		</Field>

		<Field>
			<FieldLabel class="gap-1">Category</FieldLabel>
			<Select
				type="single"
				bind:value={formData.category_id}
				onOpenChange={(open) => {
					if (!open) handleFieldBlur('category_id');
				}}
			>
				<SelectTrigger>
					{selectedCategory ? selectedCategory.name : 'Select a category'}
				</SelectTrigger>
				<SelectContent>
					{#each categories as category (category.id)}
						<SelectItem value={category.id}>{category.name}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			{#if getFieldError('category_id', touched, errors)}
				<p class="mt-1 text-sm text-red-500">{getFieldError('category_id', touched, errors)}</p>
			{/if}
		</Field>

		<Field>
			<FieldLabel class="gap-1">Description <span class="text-red-500">*</span></FieldLabel>
			<RichTextEditor
				bind:value={formData.description}
				hideAvatar={true}
				onBlur={() => handleFieldBlur('description')}
				className={getFieldError('description', touched, errors)
					? 'border-red-500! focus-visible:ring-red-300'
					: ''}
			/>
			{#if getFieldError('description', touched, errors)}
				<p class="mt-1 text-sm text-red-500">{getFieldError('description', touched, errors)}</p>
			{/if}
		</Field>
	</FieldGroup>

	<div class="mt-4 flex items-center justify-end gap-2">
		<Button variant="outline" class="min-w-32" onclick={handleOnCancelClick}>Cancel</Button>
		<Button
			variant="secondary"
			class="min-w-40"
			disabled={loading || (invalid && isFormTouched)}
			onclick={handleSubmit}
		>
			{#if loading}
				<LoaderCircle class="size-4 animate-spin" />
			{:else}
				Submit Ticket
			{/if}
		</Button>
	</div>
</form>
