<script lang="ts" module>
	import z from 'zod';

	const formSchema = z.object({
		firstname: z.string().min(1, 'Firstname is required'),
		lastname: z.string().min(1, 'Lastname is required'),
		sex: SexEnumSchema,
		birthdate: z.string().min(1, 'Birthdate is required'),
		email: z.string().email('Invalid email address'),
		contact_number: z.string().optional()
	});

	export type FormData = z.infer<typeof formSchema>;

	export const initialFormData: FormData = {
		firstname: '',
		lastname: '',
		sex: SexEnumSchema.enum.male,
		birthdate: '',
		email: '',
		contact_number: ''
	};

	export type Props = {
		formData: FormData;
		invalid?: boolean;
		onSubmit?: (formData: FormData) => void;
		onBack?: () => void;
	};
</script>

<script lang="ts">
	import { Field, FieldGroup, FieldLabel } from '$lib/components/ui/field';
	import { Input } from '$lib/components/ui/input';
	import { SexEnumSchema } from '$lib/models/common/common.schema';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { transformText } from '$lib/utils/texts.utils';
	import { SelectCalendar } from '$lib/components/ui/select-calendar';
	import { fromDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Button } from '$lib/components/ui/button';
	import {
		validateForm,
		validateField,
		getFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from '$lib/utils/form.utils';

	let {
		formData = $bindable(initialFormData),
		invalid = $bindable(false),
		onSubmit,
		onBack
	}: Props = $props();

	let sexOptions = $derived(SexEnumSchema.options);

	let birthdate = $state<DateValue | undefined>(undefined);

	let todayDate = $state<DateValue | undefined>(
		fromDate(new Date(), getLocalTimeZone())
	);


	let touched = $state<Record<keyof FormData, boolean>>(createInitialTouched(initialFormData));
	let errors = $state<Partial<Record<keyof FormData, string>>>({});

	let isFormInvalid = $derived.by(() => {
		const validation = validateForm(formData, formSchema);
		return validation.invalid;
	});

	let isFormTouched = $derived(Object.values(touched).some((value) => value === true));

	$effect(() => {
		invalid = isFormInvalid;
	});

	function handleBirthdateChange(dateValue: DateValue | undefined) {
	if (dateValue) {
		const isoString = new Date(
			dateValue.toDate(getLocalTimeZone())
		).toISOString();

		if (formData.birthdate !== isoString) {
			formData.birthdate = isoString;

			if (!touched.birthdate) {
				touched.birthdate = true;
			} else {
				const validation = validateField(
					'birthdate',
					formData,
					formSchema,
					errors
				);
				errors = validation.errors;
			}
		}
		} else {
			if (formData.birthdate !== '') {
				formData.birthdate = '';

				if (touched.birthdate) {
					const validation = validateField(
						'birthdate',
						formData,
						formSchema,
						errors
					);
					errors = validation.errors;
				}
			}
		}
	}

	function handleBirthdatePopoverClose(open: boolean) {
		if (!open && !birthdate) {
			touched.birthdate = true;
			const validation = validateField(
				'birthdate',
				formData,
				formSchema,
				errors
			);
			errors = validation.errors;
		}
	}


	function handleFieldBlur(field: keyof FormData) {
		touched[field] = true;
		const validation = validateField(field, formData, formSchema, errors);
		errors = validation.errors;
	}

	function handleSubmit() {
		// Mark all fields as touched on submit
		touched = markAllFieldsTouched(formData);

		// Validate the form
		const validation = validateForm(formData, formSchema);
		errors = validation.errors;

		// Only submit if valid
		if (!validation.invalid) {
			onSubmit?.(formData);
		}
	}

	function handleBack() {
		onBack?.();
	}
</script>

<form>
	<FieldGroup>
		<Field>
			<FieldLabel for="firstname" class="gap-1">
				<span>First Name <span class="text-red-500">*</span></span>
			</FieldLabel>
			<Input
				type="text"
				id="firstname"
				class="py-5 {getFieldError('firstname', touched, errors)
					? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
					: ''}"
				bind:value={formData.firstname}
				onblur={() => handleFieldBlur('firstname')}
			/>
			{#if getFieldError('firstname', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('firstname', touched, errors)}</span>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="lastname" class="gap-1">
				<span>Last Name <span class="text-red-500">*</span></span>
			</FieldLabel>
			<Input
				type="text"
				id="lastname"
				class="py-5 {getFieldError('lastname', touched, errors)
					? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
					: ''}"
				bind:value={formData.lastname}
				onblur={() => handleFieldBlur('lastname')}
			/>
			{#if getFieldError('lastname', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('lastname', touched, errors)}</span>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="sex" class="gap-1">
				<span>Sex <span class="text-red-500">*</span></span>
			</FieldLabel>
			<Select type="single" bind:value={formData.sex}>
				<SelectTrigger
					class="bg-white py-5 {getFieldError('sex', touched, errors)
						? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
						: ''}"
				>
					<span>{transformText(formData.sex)}</span>
				</SelectTrigger>
				<SelectContent>
					{#each sexOptions as option (option)}
						<SelectItem value={option}>{transformText(option)}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			{#if getFieldError('sex', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('sex', touched, errors)}</span>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="birthdate" class="gap-1">
				<span>Birthdate <span class="text-red-500">*</span></span>
			</FieldLabel>
			<SelectCalendar
			bind:value={birthdate}
			maxValue={todayDate}
			buttonClass="py-5 bg-white {getFieldError('birthdate', touched, errors)
				? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
				: ''}"
			onValueChange={handleBirthdateChange}
			onOpenChange={handleBirthdatePopoverClose}
		/>

			{#if getFieldError('birthdate', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('birthdate', touched, errors)}</span>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="email" class="gap-1">
				<span>Email <span class="text-red-500">*</span></span>
			</FieldLabel>
			<Input
				type="email"
				id="email"
				class="py-5 {getFieldError('email', touched, errors)
					? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
					: ''}"
				bind:value={formData.email}
				onblur={() => handleFieldBlur('email')}
			/>
			{#if getFieldError('email', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('email', touched, errors)}</span>
			{/if}
		</Field>

		<Field>
			<FieldLabel for="contact_number" class="gap-1">
				<span>Contact Number</span>
			</FieldLabel>
			<Input
				type="tel"
				id="contact_number"
				class="py-5 {getFieldError('contact_number', touched, errors)
					? 'border-destructive ring-destructive/20 dark:ring-destructive/40'
					: ''}"
				bind:value={formData.contact_number}
				onblur={() => handleFieldBlur('contact_number')}
			/>
			{#if getFieldError('contact_number', touched, errors)}
				<span class="text-sm text-red-500">{getFieldError('contact_number', touched, errors)}</span>
			{/if}
		</Field>
	</FieldGroup>

	<div class="mt-8 flex flex-col gap-2">
		<Button type="button" variant="outline" class="w-full py-5 text-sm" onclick={handleBack}
			>Back</Button
		>
		<Button
			type="submit"
			variant="secondary"
			class="w-full py-5 text-sm"
			disabled={invalid && isFormTouched}
			onclick={handleSubmit}>Save</Button
		>
	</div>
</form>
