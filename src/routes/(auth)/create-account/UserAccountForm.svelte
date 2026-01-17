<script lang="ts" module>
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import z from 'zod';
  import {
    validateForm,
    validateField,
    getFieldError,
    hasFieldError,
    createInitialTouched
  } from '$lib/utils/form.utils';
	import { InputGroup, InputGroupAddon, InputGroupInput } from '$lib/components/ui/input-group';
	import { LoaderCircle } from '@lucide/svelte';

  const formSchema = z.object({
    username: z.string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z.string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  export type FormData = z.infer<typeof formSchema>;

  export const initialFormData: FormData = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  type Props = {
    formData?: FormData;
    disabled?: boolean;
    onCancel?: () => void;
    onSubmit?: (formData: FormData) => void;
  };
</script>

<script lang="ts">
  import { usersActions } from '$lib/store/users.store';
  import { debounce } from '$lib/utils/reactive.utils';

  let { 
    formData = $bindable(initialFormData), 
    disabled = $bindable(false), 
    onCancel = () => {}, 
    onSubmit = () => {} 
  }: Props = $props();

  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));
  let isCheckingUsername = $state(false);
  let usernameAlreadyExists = $state(false);

  let isFormTouched = $derived(Object.values(touched).every((value) => value === true));
  let invalid = $derived(validateForm(formData, formSchema).invalid || usernameAlreadyExists);

  async function checkUsernameExists(username: string) {
    const usernameResult = formSchema.shape.username.safeParse(username);
    if (!usernameResult.success) {
      usernameAlreadyExists = false;
      return;
    }

    isCheckingUsername = true;
    try {
      const result = await usersActions.checkUsername(username);
      usernameAlreadyExists = result.exists;
    } catch (error) {
      console.error('Error checking username:', error);
      usernameAlreadyExists = false;
    } finally {
      isCheckingUsername = false;
    }
  }

  const debouncedCheckUsername = debounce(checkUsernameExists, 300);

  function handleInputChange(field: keyof FormData, value: string) {
    formData[field] = value;
    
    if (touched[field]) {
      const result = validateField(field, formData, formSchema, errors);
      errors = result.errors;
    }

    // Debounce username existence check
    if (field === 'username') {
      usernameAlreadyExists = false;
      debouncedCheckUsername(value);
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
    
    if (result.invalid || usernameAlreadyExists) {
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
  <div class="flex flex-col">
    <div class="text-xl font-bold">Create your account credentials</div>
    
    <div class="mt-4">
      <FieldGroup class="gap-5">
        <Field>
          <FieldLabel for="username">
            <span>Username</span>
          </FieldLabel>
          <InputGroup class="bg-white">
            <InputGroupInput
              type="text"
              id="username"
              bind:value={formData.username}
              aria-invalid={hasFieldErrorMessage('username') || usernameAlreadyExists}
              onblur={() => markTouched('username')}
              oninput={(e) => handleInputChange('username', e.currentTarget.value)}
            />
            <InputGroupAddon align="inline-end">
              {#if isCheckingUsername}
                <LoaderCircle class="size-4 animate-spin" />
              {/if}
            </InputGroupAddon>
          </InputGroup>
          {#if usernameAlreadyExists}
            <FieldError>
              Username already taken
            </FieldError>
          {/if}
          {#if getFieldErrorMessage('username')}
            <FieldError>
              {getFieldErrorMessage('username')}
            </FieldError>
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
            aria-invalid={hasFieldErrorMessage('password')}
            onblur={() => markTouched('password')}
            oninput={(e) => handleInputChange('password', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('password')}
            <FieldError>
              {getFieldErrorMessage('password')}
            </FieldError>
          {/if}
        </Field>

        <Field>
          <FieldLabel for="confirmPassword">
            <span>Confirm Password</span>
          </FieldLabel>
          <Input
            type="password"
            id="confirmPassword"
            bind:value={formData.confirmPassword}
            aria-invalid={hasFieldErrorMessage('confirmPassword')}
            onblur={() => markTouched('confirmPassword')}
            oninput={(e) => handleInputChange('confirmPassword', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('confirmPassword')}
            <FieldError>
              {getFieldErrorMessage('confirmPassword')}
            </FieldError>
          {/if}
        </Field>

        <div class="mt-4 flex gap-2">
          <Button type="button" variant="outline" class="flex-1" onclick={onCancel}>Go back</Button>
          <Button type="submit" variant="secondary" class="flex-1" disabled={invalid && isFormTouched || disabled || isCheckingUsername}>Create account</Button>
        </div>
      </FieldGroup>
    </div>
  </div>
</form>