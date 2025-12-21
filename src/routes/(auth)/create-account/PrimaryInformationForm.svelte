<script lang="ts" module>
	import { Button } from "$lib/components/ui/button";
  import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
	import { Input } from "$lib/components/ui/input";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import z from "zod";
	import {
		validateForm,
		validateField,
		getFieldError,
		hasFieldError,
		createInitialTouched,
		markAllFieldsTouched
	} from "$lib/utils/form.utils";
	import { fromDate, getLocalTimeZone, type DateValue } from "@internationalized/date";
	import { SelectCalendar } from "$lib/components/ui/select-calendar";

  export type FormData = {
    rfidNumber: string;
    firstname: string;
    lastname: string;
    sex: string;
    birthdate: string;
    email: string;
    contactNumber: string;
    department: string;
  }

	type Props = {
    invalid?: boolean;
    formData?: FormData;
    isFormTouched?: boolean;
		onProceed: (formData: FormData) => void;
	}

  const formSchema = z.object({
    rfidNumber: z.string().min(1, "RFID number is required"),
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    sex: z.string().min(1, "Sex is required"),
    birthdate: z.string().min(1, "Birthdate is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    contactNumber: z.string().min(1, "Contact number is required").max(13, "Invalid contact number").startsWith("09", "Contact number must start with 09"),
    department: z.string().min(1, "Department is required"),
  });

  const defaultFormData: FormData = {
    rfidNumber: "",
    firstname: "",
    lastname: "",
    sex: "Male",
    birthdate: "",
    email: "",
    contactNumber: "",
    department: "",
  };
</script>

<script lang="ts">
  let { 
    invalid = $bindable(true), 
    formData = $bindable(defaultFormData), 
    isFormTouched = $bindable(false),
    onProceed = () => {} 
  }: Props = $props();

  const initialFormData: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormData)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  let birthdate = $state<DateValue | undefined>(undefined);

  let todayDate = $state<DateValue | undefined>(
    fromDate(new Date(), getLocalTimeZone())
  );

  $effect(() => {
    isFormTouched = Object.values(touched).every((value) => value === true);
  });

  function handleBirthdateChange(dateValue: DateValue | undefined) {
    if (dateValue) {
      const isoString = new Date(dateValue.toDate(getLocalTimeZone())).toISOString();
      if (formData.birthdate !== isoString) {
        formData.birthdate = isoString;

        if (!touched.birthdate) {
          markTouched("birthdate");
        } else {
          validateFieldData("birthdate");
        }
      }
    } else {
      if (formData.birthdate !== "") {
        formData.birthdate = "";

        if (touched.birthdate) {
          validateFieldData("birthdate");
        }
      }
    }
  }

  function handleBirthdatePopoverClose(open: boolean) {
    if (!open && !birthdate) {
      markTouched("birthdate");
    }
  }

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
  }

  function handleSelectClose(field: "sex" | "department") {
    if (formData[field]) {
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

  function handleProceed() {
    validateFormData();
    markAllFieldsTouchedData();
    if (invalid) {
      return;
    }
    onProceed(formData);
  }
</script>

<form class="border border-border rounded-md p-6">
  <FieldGroup class="flex flex-col gap-4">
    <Field>
      <FieldLabel for="rfid-number">
        <span>RFID #</span>
      </FieldLabel>
      <Input
        type="text"
        id="rfid-number"
        placeholder="Enter your school ID number"
        bind:value={formData.rfidNumber}
        aria-invalid={hasFieldErrorMessage("rfidNumber")}
        onblur={() => markTouched("rfidNumber")}
        oninput={(e) => handleInputChange("rfidNumber", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("rfidNumber")}
        <FieldError errors={[{ message: getFieldErrorMessage("rfidNumber") }]} />
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
        aria-invalid={hasFieldErrorMessage("firstname")}
        onblur={() => markTouched("firstname")}
        oninput={(e) => handleInputChange("firstname", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("firstname")}
        <FieldError errors={[{ message: getFieldErrorMessage("firstname") }]} />
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
        aria-invalid={hasFieldErrorMessage("lastname")}
        onblur={() => markTouched("lastname")}
        oninput={(e) => handleInputChange("lastname", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("lastname")}
        <FieldError errors={[{ message: getFieldErrorMessage("lastname") }]} />
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
            handleSelectClose("sex");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("sex")}>
          {formData.sex || "Select Sex"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("sex")}
        <FieldError errors={[{ message: getFieldErrorMessage("sex") }]} />
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
        aria-invalid={hasFieldErrorMessage("birthdate")}
        buttonClass={hasFieldErrorMessage("birthdate") ? "border-destructive ring-destructive/20 dark:ring-destructive/40" : ""}
        onValueChange={handleBirthdateChange}
        onOpenChange={handleBirthdatePopoverClose}
      />
      {#if getFieldErrorMessage("birthdate")}
        <FieldError errors={[{ message: getFieldErrorMessage("birthdate") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="email">
        <span>Email</span>
      </FieldLabel>
      <Input
        type="email"
        id="email"
        bind:value={formData.email}
        aria-invalid={hasFieldErrorMessage("email")}
        onblur={() => markTouched("email")}
        oninput={(e) => handleInputChange("email", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("email")}
        <FieldError errors={[{ message: getFieldErrorMessage("email") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="contact-number">
        <span>Contact Number <span class="text-xs text-gray-500">(09*********)</span></span>
      </FieldLabel>
      <Input
        type="tel"
        id="contact-number"
        bind:value={formData.contactNumber}
        aria-invalid={hasFieldErrorMessage("contactNumber")}
        onblur={() => markTouched("contactNumber")}
        oninput={(e) => handleInputChange("contactNumber", e.currentTarget.value)}
      />
      {#if getFieldErrorMessage("contactNumber")}
        <FieldError errors={[{ message: getFieldErrorMessage("contactNumber") }]} />
      {/if}
    </Field>

    <Field>
      <FieldLabel for="department">
        <span>Department</span>
      </FieldLabel>
      <Select
        type="single"
        bind:value={formData.department}
        onOpenChange={(open) => {
          if (!open) {
            handleSelectClose("department");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("department")}>
          {formData.department || "Select Department"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="College of Information Technology">College of Information Technology</SelectItem>
          <SelectItem value="School of Teachers Education">School of Teachers Education</SelectItem>
          <SelectItem value="School of Business Administration">School of Business Administration</SelectItem>
          <SelectItem value="School of Engineering">School of Engineering</SelectItem>
          <SelectItem value="School of Arts and Sciences">School of Arts and Sciences</SelectItem>
          <SelectItem value="School of Social Sciences">School of Social Sciences</SelectItem>
          <SelectItem value="School of Law">School of Law</SelectItem>
          <SelectItem value="School of Medicine">School of Medicine</SelectItem>
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("department")}
        <FieldError errors={[{ message: getFieldErrorMessage("department") }]} />
      {/if}
    </Field>

    <Field>
      <Button type="submit" variant="secondary" disabled={invalid && isFormTouched} onclick={handleProceed}>Proceed</Button>
    </Field>
  </FieldGroup>
</form>