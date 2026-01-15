<script lang="ts" module>
	import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { ticketCategoriesNonArchivedStore } from '$lib/store/ticket-categories.store';
	import { HatGlasses, LoaderCircle } from '@lucide/svelte';
	import { z } from 'zod';
	import {
		validateForm,
		validateField,
		getFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from '$lib/utils/form.utils';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { filesActions } from '$lib/store/files.store';
	import { FilesSchema } from '$lib/models/files/files.schema';
	import FilePlaceholder from '$lib/components/common/FilePlaceholder.svelte';
	import { toast } from 'svelte-sonner';

	export const formSchema = z.object({
		title: z.string().min(1, 'Title is required'),
		category_id: z.string(),
		anon: z.boolean().default(false),
		description: z.string().min(1, 'Description is required'),
		attachments: FilesSchema.array()
	});

	export type FormData = z.infer<typeof formSchema>;

	export const initialFormData: FormData = {
		anon: false,
		title: '',
		category_id: '',
		description: '',
		attachments: []
	};

	export type Props = {
		formData?: FormData;
		loading?: boolean;
		invalid?: boolean;
		uploadedFiles?: File[];
		onSubmit?: (formData: FormData) => void;
		onCancel?: () => void;
	};
</script>

<script lang="ts">
	let {
		formData = $bindable(initialFormData),
		loading = $bindable(false),
		invalid = $bindable(false),
		uploadedFiles = $bindable([]),
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

	function openAttachments() {
		document.getElementById('attachments')?.click();
	}

	async function handleAttachmentsChange(e: Event) {
		const input = document.getElementById('attachments') as HTMLInputElement;
		const files = input.files;
		const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

		if (files) {
			const validFiles: File[] = [];
			const invalidFiles: string[] = [];

			Array.from(files).forEach((file) => {
				if (file.size > MAX_FILE_SIZE) {
					invalidFiles.push(file.name);
				} else {
					validFiles.push(file);
				}
			});

			if (invalidFiles.length > 0) {
				toast.error(`File${invalidFiles.length > 1 ? 's' : ''} too large`, {
					description: `${invalidFiles.join(', ')} exceed${invalidFiles.length === 1 ? 's' : ''} the 25MB limit`
				});
			}

			if (validFiles.length > 0) {
				uploadedFiles = [...uploadedFiles, ...validFiles];
			}
		}
		input.value = '';
	}

	$inspect(uploadedFiles);

	function handleRemoveFile(file: File) {
		uploadedFiles = uploadedFiles.filter((f) => f !== file);
	}
</script>

<form>
	<FieldGroup class="gap-3">
		<div class="flex flex-col gap-2">
			<Label
				for="anon"
				class="group flex w-full cursor-pointer items-center gap-2 rounded-md border border-border p-2 has-data-[state=checked]:border-sky-500 has-data-[state=checked]:bg-sky-50"
			>
				<div
					class="flex size-8 items-center justify-center rounded-full border-sky-300 bg-sky-100 text-sky-900 {formData.anon
						? 'border-sky-400 bg-sky-300'
						: ''}"
				>
					<HatGlasses class="size-6" />
				</div>
				<Checkbox
					id="anon"
					bind:checked={formData.anon}
					class={formData.anon
						? 'border-sky-500 bg-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-100 data-[state=checked]:text-sky-600'
						: ''}
					onblur={() => handleFieldBlur('anon')}
				/>
				<span class="text-sm font-medium">Anonymous</span>
			</Label>
			{#if formData.anon}
				<p class="text-xs text-muted-foreground">
					Your ticket will be anonymously saved. Your name will not be disclosed.
				</p>
			{/if}
		</div>
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

		<Field>
			<FieldLabel class="gap-1">Attachments</FieldLabel>
			<div
				class="group flex min-h-14 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-gray-100 p-2"
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && openAttachments()}
				onclick={openAttachments}
			>
				<Input
					id="attachments"
					type="file"
					multiple
					class="hidden"
					accept="image/*,video/*,application/pdf"
					onchange={handleAttachmentsChange}
				/>
				<span class="text-sm text-muted-foreground">Click to upload attachments</span>
			</div>
		</Field>
		{#if uploadedFiles.length > 0}
			<div class="flex gap-2 overflow-x-auto">
				{#each uploadedFiles as file}
					{@const isNonMediaFile = file.type !== 'image' && file.type !== 'video'}
					{@const sizeClass = isNonMediaFile ? 'w-52 h-32' : 'size-32'}
					<div class={sizeClass}>
						<FilePlaceholder {file} onRemove={() => handleRemoveFile(file)} />
					</div>
				{/each}
			</div>
		{/if}
	</FieldGroup>

	<div class="mt-8 flex items-center justify-end gap-2">
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
