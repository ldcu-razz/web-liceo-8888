<script lang="ts" module>
	import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
	import { transformText } from "$lib/utils/texts.utils";
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from "$lib/utils/form.utils";
  import z from "zod";
	import { Button } from "$lib/components/ui/button";

  export const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    default_department: z.string().nullable(),
    status: BaseStatusEnumSchema,
  });

  export type FormData = z.infer<typeof formSchema>;

  export const defaultFormData: FormData = {
    name: "",
    default_department: null,
    status: BaseStatusEnumSchema.enum.active,
  };

  export type Props = {
    invalid?: boolean;
    formData?: FormData;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
  };
</script>

<script lang="ts">
  let { 
    invalid = $bindable(true),
    formData = $bindable(defaultFormData), 
    onSubmit = () => {}, 
    onCancel = () => {} 
  }: Props = $props();

  const statusOptions = BaseStatusEnumSchema.options;

  const initialFormData: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormData)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  // Validate on mount to set initial invalid state
  $effect(() => {
    validateFormData();
  });

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

  function handleSelectClose(field: "default_department" | "status") {
    if (formData[field]) {
      touched[field] = true;
      validateFieldData(field);
    } else if (field === "status") {
      // Status is required, so mark as touched even if empty
      touched[field] = true;
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
    touched = markAllFieldsTouched(initialFormData);
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    validateFormData();
    markAllFieldsTouchedData();
    if (invalid) {
      return;
    }
    onSubmit?.(formData);
  }
</script>

<form class="px-4" onsubmit={handleSubmit}>
  <FieldGroup>
    <Field>
      <FieldLabel for="name" class="gap-1">Name <span class="text-red-500">*</span></FieldLabel>
      <Input 
        id="name" 
        bind:value={formData.name}
        aria-invalid={hasFieldErrorMessage("name")}
        onblur={() => markTouched("name")}
        oninput={(e) => handleInputChange("name", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("name")}
        <FieldError errors={[{ message: getFieldErrorMessage("name") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="default_department">Department</FieldLabel>
      <Select 
        type="single" 
        bind:value={formData.default_department as string | undefined}
        onOpenChange={(open) => {
          if (!open) {
            handleSelectClose("default_department");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("default_department")}>
          {#if formData.default_department}
            <span>{formData.default_department}</span>
          {:else}
            <span class="text-gray-400">Select a default department</span>
          {/if}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Department 1</SelectItem>
          <SelectItem value="2">Department 2</SelectItem>
          <SelectItem value="3">Department 3</SelectItem>
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("default_department")}
        <FieldError errors={[{ message: getFieldErrorMessage("default_department") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="status" class="gap-1">Status <span class="text-red-500">*</span></FieldLabel>
      <Select 
        type="single" 
        bind:value={formData.status}
        onOpenChange={(open) => {
          if (!open) {
            handleSelectClose("status");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("status")}>
          {formData.status ? transformText(formData.status) : "Select a status"}
        </SelectTrigger>
        <SelectContent>
          {#each statusOptions as option (option)}
            <SelectItem value={option}>{transformText(option)}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("status")}
        <FieldError errors={[{ message: getFieldErrorMessage("status") }]} />
      {/if}
    </Field>

    <div class="flex gap-2">
      <Button type="button" variant="outline" class="flex-1 bg-gray-50" onclick={() => onCancel?.()}>Cancel</Button>
      <Button type="submit" variant="secondary" class="flex-1">Save</Button>
    </div>
  </FieldGroup>
</form>