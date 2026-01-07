<script lang="ts" module>
	import { Button } from "$lib/components/ui/button";
	import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
  import z from "zod";
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from "$lib/utils/form.utils";
	import { LoaderCircle, OctagonAlertIcon } from "@lucide/svelte";

  export const formSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export type FormData = z.infer<typeof formSchema>;

  export type Props = {
    formData?: FormData;
    loading?: boolean;
    errorMessage?: string;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
  };

  export const initialFormData: FormData = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
  };
</script>

<script lang="ts">
  let {
    formData = $bindable(initialFormData),
    loading = false,
    errorMessage = "",
    onSubmit = () => {},
    onCancel = () => {}
  }: Props = $props();

  const initialFormDataValue: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormDataValue)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  let invalid = $state(true);

  let isFormTouched = $derived(Object.values(touched).some((value) => value === true));

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

    // If password changes and confirmPassword is touched, re-validate confirmPassword
    if (field === "password" && touched.confirmPassword) {
      validateFieldData("confirmPassword");
    }
    // If confirmPassword changes and password is touched, re-validate confirmPassword
    if (field === "confirmPassword" && touched.password) {
      validateFieldData("confirmPassword");
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

  function handleCancel() {
    onCancel();
  }
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  {#if errorMessage}
    <div class="flex items-center gap-2 text-red-700 bg-red-500/10 p-2 rounded-md mb-4 text-xs">
      <OctagonAlertIcon class="size-4" />
      <span>{errorMessage}</span>
    </div>
  {/if}
  <FieldGroup class="flex flex-col gap-4">
    <Field class="gap-1">
      <FieldLabel for="current-password">
        <span>Current Password</span>
      </FieldLabel>
      <Input
        type="password"
        id="current-password"
        bind:value={formData.currentPassword}
        aria-invalid={hasFieldErrorMessage("currentPassword")}
        onblur={() => markTouched("currentPassword")}
        oninput={(e) => handleInputChange("currentPassword", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("currentPassword")}
        <FieldError errors={[{ message: getFieldErrorMessage("currentPassword") }]} />
      {/if}
    </Field>

    <Field class="gap-1">
      <FieldLabel for="password">
        <span>New Password</span>
      </FieldLabel>
      <Input
        type="password"
        id="password"
        bind:value={formData.password}
        aria-invalid={hasFieldErrorMessage("password")}
        onblur={() => markTouched("password")}
        oninput={(e) => handleInputChange("password", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("password")}
        <FieldError errors={[{ message: getFieldErrorMessage("password") }]} />
      {/if}
    </Field>

    <Field class="gap-1">
      <FieldLabel for="confirm-password">
        <span>Confirm New Password</span>
      </FieldLabel>
      <Input
        type="password"
        id="confirm-password"
        bind:value={formData.confirmPassword}
        aria-invalid={hasFieldErrorMessage("confirmPassword")}
        onblur={() => markTouched("confirmPassword")}
        oninput={(e) => handleInputChange("confirmPassword", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("confirmPassword")}
        <FieldError errors={[{ message: getFieldErrorMessage("confirmPassword") }]} />
      {/if}
    </Field>
  </FieldGroup>
  
  <div class="flex justify-end gap-2 mt-6">
    <Button type="submit" variant="secondary" class="w-fit" disabled={invalid && isFormTouched}>
      {#if loading}
        <LoaderCircle class="size-4 animate-spin" />
      {/if}
      Change Password
    </Button>
    <Button type="button" variant="outline" class="w-fit" onclick={handleCancel}>Cancel</Button>
  </div>
</form>