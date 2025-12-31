<script lang="ts" module>
	import AssignedDepartmentBadge from "$lib/components/common/AssignedDepartmentBadge.svelte";
	import AssignedUserBadge from "$lib/components/common/AssignedUserBadge.svelte";
	import TicketPriorityBadge from "$lib/components/common/TicketPriorityBadge.svelte";
	import TicketStatusBadge from "$lib/components/common/TicketStatusBadge.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Field, FieldGroup, FieldLabel } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import { TicketStatusesSchema } from "$lib/models/tickets/tickets.schema";
	import { ticketCategoriesAll, ticketCategoriesNonArchivedStore } from "$lib/store/ticket-categories.store";
	import { 
		validateForm, 
		getFieldError, 
		hasFieldError, 
		markAllFieldsTouched 
	} from "$lib/utils/form.utils";
	import { LoaderCircle } from "@lucide/svelte";
  import z from "zod";

  export const formSchema = z.object({
    code: z.string().optional().default(""),
    title: z.string().min(1, "Title is required"),
    category_id: z.string().nullable().default(null),
    description: z.string().optional().default(""),
    priority: z.string().default(""),
    status: TicketStatusesSchema.default(TicketStatusesSchema.enum.backlog),
    current_department_assigned: z.string().nullable().default(null),
    current_user_assigned: z.string().nullable().default(null),
    reported_by: z.string().nullable().default(null),
  });

  export type FormData = z.infer<typeof formSchema>;

  export const initialFormData: FormData = {
    category_id: null,
    code: "",
    title: "",
    description: "",
    priority: "",
    status: TicketStatusesSchema.enum.backlog,
    current_department_assigned: null,
    current_user_assigned: null,
    reported_by: "",
  };

  export type Props = {
    formData?: FormData;
    loading?: boolean;
    disabledPositiveButton?: boolean;
    invalid?: boolean;
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
    onSubmit = () => {},
    onCancel = () => {},
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
  });

  let isFormTouched = $derived(Object.values(touchedFields).some((value) => value === true));

  let ticketCategories = $derived($ticketCategoriesNonArchivedStore);

  let selectedCategory = $derived(ticketCategories.find((category) => category.id === formData.category_id));

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
        class={hasFieldError('title', touchedFields, errors) ? 'border-red-500! focus-visible:ring-red-300' : ''}
      />
      {#if getFieldError('title', touchedFields, errors)}
        <p class="text-sm text-red-500 mt-1">{getFieldError('title', touchedFields, errors)}</p>
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
        <SelectTrigger class={hasFieldError('category_id', touchedFields, errors) ? 'border-red-500! focus-visible:ring-red-300' : ''}>
          {selectedCategory ? selectedCategory.name : "Select a category"}
        </SelectTrigger>

        <SelectContent>
          {#each ticketCategories as category}
            <SelectItem value={category.id}>{category.name}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
      {#if getFieldError('category_id', touchedFields, errors)}
        <p class="text-sm text-red-500 mt-1">{getFieldError('category_id', touchedFields, errors)}</p>
      {/if}
    </Field>

    <Field class="gap-1">
      <FieldLabel for="description" class="gap-1">
        <span>Description</span>
      </FieldLabel>
      <Textarea 
        id="description" 
        bind:value={formData.description} 
        rows={8}
        onblur={() => handleFieldBlur('description')}
        class={hasFieldError('description', touchedFields, errors) ? 'border-red-500 focus-visible:ring-red-500' : ''}
      />
      {#if getFieldError('description', touchedFields, errors)}
        <p class="text-sm text-red-500 mt-1">{getFieldError('description', touchedFields, errors)}</p>
      {/if}
    </Field>
  </FieldGroup>

  <div class="flex gap-2 mt-4">
    <TicketPriorityBadge bind:selectedPriority={formData.priority} />
    <AssignedDepartmentBadge bind:selectedDepartmentId={formData.current_department_assigned} />
    <AssignedUserBadge bind:selectedUserId={formData.current_user_assigned} />
    <TicketStatusBadge bind:selectedStatus={formData.status} size="sm" />
  </div>

  <div class="flex items-center justify-end gap-2 mt-8">
    <Button type="button" variant="outline" class="min-w-32" onclick={handleOnCancelClick}>Cancel</Button>
    <Button type="submit" variant="secondary" class="min-w-40" disabled={disabledPositiveButton || (isFormTouched && invalid) || loading}>
      {#if loading}
        <LoaderCircle class="size-4 animate-spin" />
      {:else}
        Create Ticket
      {/if}
    </Button>
  </div>
</form>