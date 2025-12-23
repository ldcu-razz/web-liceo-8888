<script lang="ts" module>
	import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
  import z from "zod";
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from "$lib/utils/form.utils";

  export const formSchema = z.object({
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export type FormData = z.infer<typeof formSchema>;

  export const defaultFormData: FormData = {
    password: "",
    confirmPassword: "",
  };

  export type Props = {
    formData?: FormData;
    onSubmit?: (formData: FormData) => void;
    onCancel?: () => void;
  };
</script>

<script lang="ts">
  let {
    formData = $bindable(defaultFormData),
    onSubmit = () => {},
    onCancel = () => {}
  }: Props = $props();

  const initialFormData: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormData)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  let isFormTouched = $derived(Object.values(touched).every((value) => value === true));

  let invalid = $state(true);

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
    formData[field] = value;
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
    touched = markAllFieldsTouched(initialFormData);
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

<form  class="px-4" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <FieldGroup class="flex flex-col gap-4">
    <Field>
      <FieldLabel for="password">
        <span>Password</span>
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

    <Field>
      <FieldLabel for="confirm-password">
        <span>Confirm Password</span>
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

    <FieldGroup class="flex flex-row justify-end gap-2 mt-2">
      <Field>
        <Button type="button" variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
      </Field>
      <Field>
        <Button type="submit" variant="secondary" class="w-fit" disabled={invalid && isFormTouched}>
          Change Password
        </Button>
      </Field>
    </FieldGroup>
  </FieldGroup>
</form>