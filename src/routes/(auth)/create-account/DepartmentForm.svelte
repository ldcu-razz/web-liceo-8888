<script lang="ts" module>
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';
  import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
	import z from 'zod';
	import { UUIDSchema } from '$lib/models/common/common.schema';
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
	} from '$lib/utils/form.utils';
	import { departmentsStore } from '$lib/store/departments.store';
	import { CheckIcon } from '@lucide/svelte';
	import UserAvatar from '$lib/components/common/UserAvatar.svelte';

  const formSchema = z.object({
    department_id: z.union([UUIDSchema, z.literal('')]),
  });

  export type FormData = z.infer<typeof formSchema>;

  export const initialFormData: FormData = {
    department_id: '',
  };

  type Props = {
    formData?: FormData;
    disabled?: boolean;
    onCancel?: () => void;
    onSubmit?: (formData: FormData) => void;
  };
</script>

<script lang="ts">
  let {
    formData = $bindable(initialFormData),
    disabled = $bindable(false),
    onCancel = () => {},
    onSubmit = () => {}
  }: Props = $props();

  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));
  let isFormTouched = $derived(Object.values(touched).every((value) => value === true));
  let invalid = $derived(validateForm(formData, formSchema).invalid);

  let departments = $derived($departmentsStore);
  let searchQuery = $state('');
  
  let filteredDepartments = $derived(
    departments.filter((department) =>
      department.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  let selectedDepartment = $derived(
    departments.find((dept) => dept.id === formData.department_id)
  );

  function markTouched(field: keyof FormData) {
    touched[field] = true;
  }

  function hasFieldErrorMessage(field: keyof FormData): boolean {
    return hasFieldError(field, touched, errors);
  }

  function getFieldErrorMessage(field: keyof FormData): string | undefined {
    return getFieldError(field, touched, errors);
  }

  function validateFieldData(field: keyof FormData) {
    const result = validateField(field, formData, formSchema, errors);
    errors = result.errors;
    invalid = result.invalid;
  }

  function handleSubmit() {
    const result = validateForm(formData, formSchema);
    if (result.invalid) {
      errors = result.errors;
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
    <div class="w-full">
      <FieldGroup class="gap-5">
        <Field>
          <FieldLabel for="department_id">
            <span class="text-xl font-bold">Select your current department</span>
          </FieldLabel>
          <Select
            type="single"
            bind:value={formData.department_id}
            onOpenChange={(open) => {
              if (!open) {
                markTouched('department_id');
                searchQuery = '';
              }
            }}
          >
            <SelectTrigger aria-invalid={hasFieldErrorMessage('department_id')} class="bg-white">
              {selectedDepartment?.name ?? 'Select Department'}
            </SelectTrigger>
            <SelectContent class="relative">
              <div class="absolute top-0 left-0 right-0 z-10 bg-popover p-2">
                <Input
                  type="text"
                  placeholder="Search departments..."
                  bind:value={searchQuery}
                  onpointerdown={(e) => e.stopPropagation()}
                  onkeydown={(e) => e.stopPropagation()}
                />
              </div>
              <div class="mt-12 max-h-62 overflow-y-auto">
                {#each filteredDepartments as department (department.id)}
                  <SelectItem value={department.id}>
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <div class="flex items-center gap-1.5">
                          <UserAvatar
                            name={department.name}
                            imageLink={department.avatar ?? ''}
                            sizeClass="size-6"
                            textSizeClass="text-[10px]"
                          />
                        </div>
                        <div class="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                          {department.name}
                        </div>
                      </div>
      
                      {#if department.id === formData.department_id}
                        <CheckIcon class="size-4 text-green-700" />
                      {/if}
                    </div>
                  </SelectItem>
                {:else}
                  <div class="px-2 py-6 text-center text-sm text-muted-foreground">
                    No departments found.
                  </div>
                {/each}
              </div>
            </SelectContent>
          </Select>
          <FieldDescription>
            Select what department are you currently in. This is optional but it's recommended to select your current department.
          </FieldDescription>
          {#if getFieldErrorMessage('department_id')}
            <FieldError>
              {getFieldErrorMessage('department_id')}
            </FieldError>
          {/if}
        </Field>

        <div class="mt-4 flex gap-2">
          <Button type="button" variant="outline" class="flex-1" onclick={onCancel}>Go back</Button>
          <Button type="submit" variant="secondary" class="flex-1" disabled={invalid && isFormTouched}>Continue</Button>
        </div>
      </FieldGroup>
    </div>
  </div>
</form>