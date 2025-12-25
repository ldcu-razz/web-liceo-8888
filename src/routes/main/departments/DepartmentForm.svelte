<script lang="ts" module>
  import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { Textarea } from "$lib/components/ui/textarea";
	import type { BaseStatusEnum } from "$lib/models/common/common.type";
	import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
  import z from "zod";
	import { Button } from "$lib/components/ui/button";
	import XIcon from "@lucide/svelte/icons/x";
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from "$lib/utils/form.utils";

  export const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    abbreviation: z.string().min(1, "Abbreviation is required"),
    description: z.string().optional().default(""),
    keywords: z.array(z.string()).optional().default([]),
    status: BaseStatusEnumSchema,
  });

  export type FormData = z.infer<typeof formSchema>;

  export const defaultFormData: FormData = {
    name: "",
    abbreviation: "",
    description: "",
    keywords: [],
    status: BaseStatusEnumSchema.enum.active,
  };

  export type Props = {
    formData?: FormData;
    disabledPositiveButton?: boolean;
    invalid?: boolean;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
  };
</script>

<script lang="ts">
  let { formData = $bindable(defaultFormData),  invalid = $bindable(true), disabledPositiveButton = false, onSubmit = () => {}, onCancel = () => {} }: Props = $props();
  
	let touched = $state<Record<keyof FormData, boolean>>(
		createInitialTouched(formData)
	);

	let errors = $state<Partial<Record<keyof FormData, string>>>({});

	let keywordsInput = $state("");

  let isFormTouched = $derived(Object.values(touched).some((value) => value === true));

	const statusOptions = BaseStatusEnumSchema.options;
	
  $effect(() => {
    invalid = !validateFormData();
  });

	function getStatusLabel(value: BaseStatusEnum): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	// Handle adding a keyword on Enter
	function handleKeywordsKeydown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmedKeyword = keywordsInput.trim();
			if (trimmedKeyword && !formData.keywords.includes(trimmedKeyword)) {
				formData.keywords = [...formData.keywords, trimmedKeyword];
				keywordsInput = "";
				if (touched.keywords) {
					validateFieldData("keywords");
				}
			}
		}
	}

	// Handle removing a keyword
	function removeKeyword(keywordToRemove: string) {
		formData.keywords = formData.keywords.filter(k => k !== keywordToRemove);
		if (touched.keywords) {
			validateFieldData("keywords");
		}
	}

	function validateFormData() {
		const result = validateForm(formData, formSchema);
		errors = result.errors;
		return !result.invalid;
	}

	function validateFieldData(field: keyof FormData) {
		const result = validateField(field, formData, formSchema, errors);
		errors = result.errors;
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
		touched = markAllFieldsTouched(formData);
	}

  function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		markAllFieldsTouchedData();
		if (!validateFormData()) {
			return;
		}
		onSubmit(formData);
  }
</script>

<form onsubmit={handleSubmit}>
  <FieldGroup>
    <Field>
      <FieldLabel for="department-name" class="gap-1">Department name<span class="text-red-500">*</span></FieldLabel>
      <Input
        id="department-name"
        type="text"
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
      <FieldLabel for="abbreviation" class="gap-1">Abbreviation<span class="text-red-500">*</span></FieldLabel>
      <Input
        id="abbreviation"
        type="text"
        bind:value={formData.abbreviation}
        aria-invalid={hasFieldErrorMessage("abbreviation")}
        onblur={() => markTouched("abbreviation")}
        oninput={(e) => handleInputChange("abbreviation", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("abbreviation")}
        <FieldError errors={[{ message: getFieldErrorMessage("abbreviation") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="description">Description</FieldLabel>
      <Textarea
        id="description"
        bind:value={formData.description}
        aria-invalid={hasFieldErrorMessage("description")}
        onblur={() => markTouched("description")}
        oninput={(e) => handleInputChange("description", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("description")}
        <FieldError errors={[{ message: getFieldErrorMessage("description") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="keywords">Keywords</FieldLabel>
      <Input
        id="keywords"
        type="text"
        bind:value={keywordsInput}
        placeholder="Type a keyword and press Enter"
        aria-invalid={hasFieldErrorMessage("keywords")}
        onblur={() => markTouched("keywords")}
        onkeydown={handleKeywordsKeydown}
      />
      {#if formData.keywords.length > 0}
        <div class="flex flex-wrap gap-2 mt-2">
          {#each formData.keywords as keyword (keyword)}
            <div class="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700">
              <span>{keyword}</span>
              <button
                type="button"
                onclick={() => removeKeyword(keyword)}
                class="ml-1 rounded-full hover:bg-gray-100 p-0.5 transition-colors"
                aria-label="Remove keyword"
              >
                <XIcon class="size-3 text-gray-500" />
              </button>
            </div>
          {/each}
        </div>
      {/if}
      {#if getFieldErrorMessage("keywords")}
        <FieldError errors={[{ message: getFieldErrorMessage("keywords") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="status" class="gap-1">Status<span class="text-red-500">*</span></FieldLabel>
      <Select
        type="single"
        bind:value={formData.status}
        onOpenChange={(open) => {
          if (!open) {
            markTouched("status");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("status")}>
          {formData.status ? getStatusLabel(formData.status) : "Select Status"}
        </SelectTrigger>
        <SelectContent>
          {#each statusOptions as option (option)}
            <SelectItem value={option}>{getStatusLabel(option)}</SelectItem>
          {/each}
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("status")}
        <FieldError errors={[{ message: getFieldErrorMessage("status") }]} />
      {/if}
    </Field>
  </FieldGroup>

  <div class="flex gap-2 mt-6">
    <Button type="button" variant="outline" class="flex-1 bg-gray-50" onclick={() => onCancel?.()}>Cancel</Button>
    <Button type="submit" variant="secondary" class="flex-1" disabled={disabledPositiveButton || (isFormTouched && invalid)}>Save</Button>
  </div>
</form>