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

  export type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
  }

	type Props = {
    invalid?: boolean;
    formData?: FormData;
    isFormTouched?: boolean;
		onCreateAccount: (formData: FormData) => void;
	}

  const formSchema = z.object({
    username: z.string().min(1, "Username is required").min(6, "Username must be at least 6 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens (-), and underscores (_)"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const defaultFormData: FormData = {
    username: "",
    password: "",
    confirmPassword: "",
  };
</script>

<script lang="ts">
  let { 
    invalid = $bindable(true), 
    formData = $bindable(defaultFormData),
    isFormTouched = $bindable(false),
    onCreateAccount = () => {} 
  }: Props = $props();

  const initialFormData: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormData)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  $effect(() => {
    isFormTouched = Object.values(touched).every((value) => value === true);
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
    onCreateAccount(formData);
  }
</script>

<form class="border border-border rounded-md p-6" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <FieldGroup class="flex flex-col gap-4">
    <Field>
      <FieldLabel for="username">
        <span>Username</span>
      </FieldLabel>
      <Input
        type="text"
        id="username"
        bind:value={formData.username}
        aria-invalid={hasFieldErrorMessage("username")}
        onblur={() => markTouched("username")}
        oninput={(e) => handleInputChange("username", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("username")}
        <FieldError errors={[{ message: getFieldErrorMessage("username") }]} />
      {/if}
    </Field>

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

    <Field>
      <Button type="submit" variant="secondary" disabled={invalid && isFormTouched}>Create Account</Button>
    </Field>
  </FieldGroup>
</form>