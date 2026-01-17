<script lang="ts" module>
	import { Field, FieldLabel, FieldError, FieldDescription } from '$lib/components/ui/field';
	import FieldGroup from '$lib/components/ui/field/field-group.svelte';
	import { Input } from '$lib/components/ui/input';
  import z from 'zod';
  import {
    validateForm,
    validateField,
    getFieldError,
    hasFieldError,
    createInitialTouched
  } from '$lib/utils/form.utils';
	import { Button } from '$lib/components/ui/button';

  const formSchema = z.object({
    email: z.string().min(1, 'The email address is required').email('The email address is invalid').refine((email) => email.includes('liceo.edu.ph'), {
      message: 'The email address is not a valid Liceo email address',
    }),
  });

  export type FormData = z.infer<typeof formSchema>;

  export const initialFormData: FormData = {
    email: '',
  };

  type Props = {
    formData?: FormData;
    onSubmit?: (formData: FormData) => void;
  };
</script>

<script lang="ts">
  import { usersActions } from '$lib/store/users.store';
  import { debounce } from '$lib/utils/reactive.utils';
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { LoaderCircle } from '@lucide/svelte';

  let {
    formData = $bindable(initialFormData),
    onSubmit = () => {}
  }: Props = $props();

  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));
  let isCheckingEmail = $state(false);
  let emailAlreadyExists = $state(false);

  let isFormTouched = $derived(Object.values(touched).every((value) => value === true));
  let invalid = $derived(validateForm(formData, formSchema).invalid || emailAlreadyExists);

  async function checkEmailExists(email: string) {
    const emailResult = formSchema.shape.email.safeParse(email);
    if (!emailResult.success) {
      emailAlreadyExists = false;
      return;
    }

    isCheckingEmail = true;
    try {
      const result = await usersActions.checkEmail(email);
      emailAlreadyExists = result.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      emailAlreadyExists = false;
    } finally {
      isCheckingEmail = false;
    }
  }

  const debouncedCheckEmail = debounce(checkEmailExists, 300);

  function handleInputChange(field: keyof FormData, value: string) {
    formData[field] = value as FormData[keyof FormData];
    
    if (touched[field]) {
      const result = validateField(field, formData, formSchema, errors);
      errors = result.errors;
    }

    // Debounce email existence check
    if (field === 'email') {
      emailAlreadyExists = false;
      debouncedCheckEmail(value);
    }
  }

  function markTouched(field: keyof FormData) {
    touched[field] = true;
    const result = validateField(field, formData, formSchema, errors);
    errors = result.errors;
  }

  function hasFieldErrorMessage(field: keyof FormData): boolean {
    return hasFieldError(field, touched, errors);
  }

  function getFieldErrorMessage(field: keyof FormData): string | undefined {
    return getFieldError(field, touched, errors);
  }

  function handleSubmit() {
    const result = validateForm(formData, formSchema);
    
    if (result.invalid || emailAlreadyExists) {
      errors = result.errors;
      // Mark all fields as touched to show errors
      Object.keys(formData).forEach((key) => {
        touched[key as keyof FormData] = true;
      });
      return;
    }

    onSubmit(formData);
  }
</script>

<form onsubmit={(e) => {
  e.preventDefault();
  handleSubmit();
}}>
  <FieldGroup>
    <Field class="gap-2">
      <FieldLabel for="email" class="text-xl font-bold">
        <span>Enter your Email Address</span>
      </FieldLabel>
      <InputGroup class="bg-white">
        <InputGroupInput
          type="email"
          id="email"
          bind:value={formData.email}
          aria-invalid={hasFieldErrorMessage('email') || emailAlreadyExists}
          onblur={() => markTouched('email')}
          oninput={(e) => handleInputChange('email', e.currentTarget.value)}
        />
        <InputGroupAddon align="inline-end">
          {#if isCheckingEmail}
            <LoaderCircle class="size-4 animate-spin" />
          {/if}
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Use your Liceo email address to create your account</FieldDescription>
      {#if emailAlreadyExists}
        <FieldError>
          Email already registered
        </FieldError>
      {/if}
      {#if getFieldErrorMessage('email')}
        <FieldError>
          {getFieldErrorMessage('email')}
        </FieldError>
      {/if}
    </Field>
  </FieldGroup>
  
  <div class="mt-6">
    <Button type="submit" variant="secondary" class="w-full" disabled={invalid && isFormTouched || isCheckingEmail}>Continue</Button>
  </div>
</form>