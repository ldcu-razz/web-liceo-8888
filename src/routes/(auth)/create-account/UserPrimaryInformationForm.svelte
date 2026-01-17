<script lang="ts" module>
	import { SexEnumSchema } from '$lib/models/common/common.schema';
  import z from 'zod';
  import {
    validateForm,
    validateField,
    getFieldError,
    hasFieldError,
    createInitialTouched,

	markAllFieldsTouched

  } from '$lib/utils/form.utils';
	import { Field, FieldError, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { transformText } from '$lib/utils/texts.utils';
	import { SelectCalendar } from '$lib/components/ui/select-calendar';
	import { fromDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Button } from '$lib/components/ui/button';

  const formSchema = z.object({
    rfid_number: z.string().min(1, 'Your RFID number is required'),
    firstname: z.string().min(1, 'You first name is required'),
    lastname: z.string().min(1, 'Your last name is required'),
    sex: SexEnumSchema,
    birthdate: z.string().min(1, 'Your birthdate is required'),
    contact_number: z.string()
      .refine(
        (val) => val === '' || val.length <= 13,
        { message: 'Your contact number must not exceed 13 characters' }
      )
      .refine(
        (val) => val === '' || val.startsWith('09'),
        { message: 'Your contact number must start with 09' }
      ),
  });

  export type FormData = z.infer<typeof formSchema>;

  export const initialFormData: FormData = {
    rfid_number: '',
    firstname: '',
    lastname: '',
    sex: SexEnumSchema.enum.male,
    birthdate: '',
    contact_number: ''
  };

  type Props = {
    formData?: FormData;
    onCancel?: () => void;
    onSubmit?: (formData: FormData) => void;
  };
</script>

<script lang="ts">
  let {
    formData = $bindable(initialFormData),
    onCancel = () => {},
    onSubmit = () => {}
  }: Props = $props();

  let errors = $state<Partial<Record<keyof FormData, string>>>({});
  let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));

  let isFormTouched = $derived(Object.values(touched).every((value) => value === true));
  let invalid = $derived(validateForm(formData, formSchema).invalid);

  let birthdate = $state<DateValue | undefined>(undefined);
  let todayDate = $state<DateValue | undefined>(fromDate(new Date(), getLocalTimeZone()));

  let sexOptions = $derived(SexEnumSchema.options);

  function handleInputChange(field: keyof FormData, value: string) {
    if (field === 'sex') {
      formData.sex = value as typeof formData.sex;
    } else {
      formData[field] = value;
    }
    
    if (touched[field]) {
      const result = validateField(field, formData, formSchema, errors);
      errors = result.errors;
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

  function validateFieldData(field: keyof FormData) {
    const result = validateField(field, formData, formSchema, errors);
    errors = result.errors;
    invalid = result.invalid;
  }

  function handleBirthdateChange(dateValue: DateValue | undefined) {
		if (dateValue) {
			const isoString = new Date(dateValue.toDate(getLocalTimeZone())).toISOString();
			if (formData.birthdate !== isoString) {
				formData.birthdate = isoString;

				if (!touched.birthdate) {
					markTouched('birthdate');
				} else {
					validateFieldData('birthdate');
				}
			}
		} else {
			if (formData.birthdate !== '') {
				formData.birthdate = '';

				if (touched.birthdate) {
					validateFieldData('birthdate');
				}
			}
		}
	}

  function markAllFieldsTouchedData() {
    touched = markAllFieldsTouched(initialFormData);
  }

	function handleBirthdatePopoverClose(open: boolean) {
		if (!open && !birthdate) {
			markTouched('birthdate');
		}
	}

  function handleSubmit() {
    const result = validateForm(formData, formSchema);
    
    markAllFieldsTouchedData();
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
    <div class="text-xl font-bold">Enter your primary information</div>
    
    <div class="mt-4">
      <FieldGroup class="gap-5">
        <Field>
          <FieldLabel for="rfid_number">
            <span>RFID Number</span>
          </FieldLabel>
          <Input
            type="text"
            id="rfid_number"
            bind:value={formData.rfid_number}
            aria-invalid={hasFieldErrorMessage('rfid_number')}
            onblur={() => markTouched('rfid_number')}
            oninput={(e) => handleInputChange('rfid_number', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('rfid_number')}
            <FieldError>
              {getFieldErrorMessage('rfid_number')}
            </FieldError>
          {/if}
        </Field>

        <Field>
          <FieldLabel for="firstname">
            <span>Firstname</span>
          </FieldLabel>
          <Input
            type="text"
            id="firstname"
            bind:value={formData.firstname}
            aria-invalid={hasFieldErrorMessage('firstname')}
            onblur={() => markTouched('firstname')}
            oninput={(e) => handleInputChange('firstname', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('firstname')}
            <FieldError>
              {getFieldErrorMessage('firstname')}
            </FieldError>
          {/if}
        </Field>

        <Field>
          <FieldLabel for="lastname">
            <span>Lastname</span>
          </FieldLabel>
          <Input
            type="text"
            id="lastname"
            bind:value={formData.lastname}
            aria-invalid={hasFieldErrorMessage('lastname')}
            onblur={() => markTouched('lastname')}
            oninput={(e) => handleInputChange('lastname', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('lastname')}
            <FieldError>
              {getFieldErrorMessage('lastname')}
            </FieldError>
          {/if}
        </Field>

        <Field>
          <FieldLabel for="sex">
            <span>Sex</span>
          </FieldLabel>
          <Select
            type="single"
            bind:value={formData.sex}
            onOpenChange={(open) => {
              if (!open) {
                markTouched('sex');
              }
            }}
          >
            <SelectTrigger aria-invalid={hasFieldErrorMessage('sex')} class="bg-white">
              {formData.sex ? transformText(formData.sex) : 'Select Sex'}
            </SelectTrigger>
            <SelectContent>
              {#each sexOptions as option (option)}
                <SelectItem value={option}>{transformText(option)}</SelectItem>
              {/each}
            </SelectContent>
          </Select>
          {#if getFieldErrorMessage('sex')}
            <FieldError>
              {getFieldErrorMessage('sex')}
            </FieldError>
          {/if}
        </Field>

        <Field>
          <FieldLabel for="birthdate">
            <span>Birthdate</span>
          </FieldLabel>
          <SelectCalendar
            bind:value={birthdate}
            id="birthdate"
            maxValue={todayDate}
            aria-invalid={hasFieldErrorMessage('birthdate')}
            buttonClass={hasFieldErrorMessage('birthdate')
              ? 'border-destructive ring-destructive/20 dark:ring-destructive/40 bg-white'
              : 'bg-white'}
            onValueChange={handleBirthdateChange}
            onOpenChange={handleBirthdatePopoverClose}
          />
          {#if getFieldErrorMessage('birthdate')}
            <FieldError errors={[{ message: getFieldErrorMessage('birthdate') }]} />
          {/if}
        </Field>

        <Field>
          <FieldLabel for="contact_number">
            <span>Contact Number</span>
          </FieldLabel>
          <Input
            type="tel"
            id="contact_number"
            bind:value={formData.contact_number}
            aria-invalid={hasFieldErrorMessage('contact_number')}
            onblur={() => markTouched('contact_number')}
            oninput={(e) => handleInputChange('contact_number', e.currentTarget.value)}
          />
          {#if getFieldErrorMessage('contact_number')}
            <FieldError>
              {getFieldErrorMessage('contact_number')}
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