<script lang="ts" module>
	import AssignedDepartmentBadge from '$lib/components/common/AssignedDepartmentBadge.svelte';
	import AssignedUserBadge from '$lib/components/common/AssignedUserBadge.svelte';
	import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
	import TicketPriorityBadge from '$lib/components/common/TicketPriorityBadge.svelte';
	import TicketStatusBadge from '$lib/components/common/TicketStatusBadge.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { TicketStatusesSchema } from '$lib/models/tickets/tickets.schema';
	import { ticketCategoriesNonArchivedStore } from '$lib/store/ticket-categories.store';
	import {
		validateForm,
		getFieldError,
		hasFieldError,
		markAllFieldsTouched
	} from '$lib/utils/form.utils';
	import { LoaderCircle } from '@lucide/svelte';
	import z from 'zod';
	import { FilesSchema } from '$lib/models/files/files.schema';
	import FilePlaceholder from '$lib/components/common/FilePlaceholder.svelte';
	import { toast } from 'svelte-sonner';

	export const formSchema = z.object({
		code: z.string().optional().default(''),
		title: z.string().min(1, 'Title is required'),
		category_id: z.string().nullable().default(null),
		description: z.string().optional().default(''),
		priority: z.string().default(''),
		status: TicketStatusesSchema.default(TicketStatusesSchema.enum.backlog),
		current_department_assigned: z.string().nullable().default(null),
		current_user_assigned: z.string().nullable().default(null),
		reported_by: z.string().nullable().default(null),
		attachments: FilesSchema.array()
	});

	export type FormData = z.infer<typeof formSchema>;

	export const initialFormData: FormData = {
		category_id: null,
		code: '',
		title: '',
		description: '',
		priority: '',
		status: TicketStatusesSchema.enum.backlog,
		current_department_assigned: null,
		current_user_assigned: null,
		reported_by: '',
		attachments: []
	};

	export type Props = {
		formData?: FormData;
		loading?: boolean;
		disabledPositiveButton?: boolean;
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
		disabledPositiveButton = false,
		invalid = $bindable(false),
		uploadedFiles = $bindable([]),
		onSubmit = () => {},
		onCancel = () => {}
	}: Props = $props();

	let touchedFields = $state<Record<keyof FormData, boolean>>({
		title: false,
		description: false,
		code: false,
		category_id: false,
		priority: false,
		status: false,
		current_department_assigned: false,
		current_user_assigned: false,
		reported_by: false,
		attachments: false
	});

	let isFormTouched = $derived(Object.values(touchedFields).some((value) => value === true));

	let ticketCategories = $derived($ticketCategoriesNonArchivedStore);

	let selectedCategory = $derived(
		ticketCategories.find((category) => category.id === formData.category_id)
	);

	// Derive validation state from formData
	const validation = $derived(validateForm(formData, formSchema));
	const errors = $derived(validation.errors);

	// Update invalid prop reactively
	$effect(() => {
		invalid = validation.invalid;
	});

	function handleFieldBlur(fieldName: keyof FormData) {
		touchedFields[fieldName] = true;
	}

	function handleOnCancelClick() {
		formData = { ...initialFormData };
		onCancel?.();
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		touchedFields = markAllFieldsTouched(formData);

		if (!validation.invalid) {
			onSubmit(formData);
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

	function handleRemoveFile(file: File) {
		uploadedFiles = uploadedFiles.filter((f) => f !== file);
	}
</script>

<form onsubmit={handleSubmit}>
	<FieldGroup class="gap-4">
		<Field class="gap-1">
			<FieldLabel for="title" class="gap-1">
				<span>Title <span class="text-red-500">*</span></span>
			</FieldLabel>
			<Input
				type="text"
				id="title"
				bind:value={formData.title}
				onblur={() => handleFieldBlur('title')}
				class={hasFieldError('title', touchedFields, errors)
					? 'border-red-500! focus-visible:ring-red-300'
					: ''}
			/>
			{#if getFieldError('title', touchedFields, errors)}
				<p class="mt-1 text-sm text-red-500">{getFieldError('title', touchedFields, errors)}</p>
			{/if}
		</Field>

		<Field class="gap-1">
			<FieldLabel for="category_id" class="gap-1">
				<span>Category</span>
			</FieldLabel>
			<Select
				type="single"
				bind:value={formData.category_id as string | undefined}
				onOpenChange={(open) => {
					if (!open) {
						handleFieldBlur('category_id');
					}
				}}
			>
				<SelectTrigger
					class={hasFieldError('category_id', touchedFields, errors)
						? 'border-red-500! focus-visible:ring-red-300'
						: ''}
				>
					{selectedCategory ? selectedCategory.name : 'Select a category'}
				</SelectTrigger>

				<SelectContent>
					{#each ticketCategories as category}
						<SelectItem value={category.id}>{category.name}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			{#if getFieldError('category_id', touchedFields, errors)}
				<p class="mt-1 text-sm text-red-500">
					{getFieldError('category_id', touchedFields, errors)}
				</p>
			{/if}
		</Field>

		<Field class="gap-1">
			<FieldLabel for="description" class="gap-1">
				<span>Description</span>
			</FieldLabel>
			<RichTextEditor
				bind:value={formData.description}
				placeholder="Write a description"
				hideAvatar={true}
				onBlur={() => handleFieldBlur('description')}
				className={hasFieldError('description', touchedFields, errors)
					? 'border-red-500 focus-visible:ring-red-500'
					: ''}
			/>
			{#if getFieldError('description', touchedFields, errors)}
				<p class="mt-1 text-sm text-red-500">
					{getFieldError('description', touchedFields, errors)}
				</p>
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

	<div class="mt-4 flex gap-2">
		<TicketPriorityBadge bind:selectedPriority={formData.priority} />
		<AssignedDepartmentBadge bind:selectedDepartmentId={formData.current_department_assigned} />
		<AssignedUserBadge bind:selectedUserId={formData.current_user_assigned} />
		<TicketStatusBadge bind:selectedStatus={formData.status} size="sm" />
	</div>

	<div class="mt-8 flex items-center justify-end gap-2">
		<Button type="button" variant="outline" class="min-w-32" onclick={handleOnCancelClick}
			>Cancel</Button
		>
		<Button
			type="submit"
			variant="secondary"
			class="min-w-40"
			disabled={disabledPositiveButton || (isFormTouched && invalid) || loading}
		>
			{#if loading}
				<LoaderCircle class="size-4 animate-spin" />
			{:else}
				Create Ticket
			{/if}
		</Button>
	</div>
</form>
