<script lang="ts" module>
  import { Button } from "$lib/components/ui/button";
  import { Field, FieldGroup, FieldLabel, FieldError } from "$lib/components/ui/field";
  import FieldSeparator from "$lib/components/ui/field/field-separator.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
  import { SelectCalendar } from "$lib/components/ui/select-calendar";
	import { SexEnumSchema, UUIDSchema } from "$lib/models/common/common.schema";
	import { UserRolesEnumSchema } from "$lib/models/users/users.schema";
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
	import { transformText } from "$lib/utils/texts.utils";

  export type FormData = z.infer<typeof formSchema>;
  
  export type Mode = "create" | "update";

  export type Props = {
    mode?: Mode;
    invalid?: boolean;
    formData?: FormData;
    formBordered?: boolean;
    onCancel?: () => void;
    onCreateUser?: (formData: FormData) => void;
    onUpdateUser?: (formData: FormData) => void;
  };

  export const formSchema = z.object({
    rfidNumber: z.string().min(1, "RFID number is required"),
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    sex: SexEnumSchema,
    birthdate: z.string().min(1, "Birthdate is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    contactNumber: z.string().min(1, "Contact number is required").max(13, "Invalid contact number").startsWith("09", "Contact number must start with 09"),
    department: z.string().min(1, "Department is required"),
    role: UserRolesEnumSchema,
    username: z.string().min(1, "Username is required").min(6, "Username must be at least 6 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens (-), and underscores (_)"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  export const defaultFormData: FormData = {
    rfidNumber: "",
    firstname: "",
    lastname: "",
    sex: SexEnumSchema.enum.male,
    birthdate: "",
    email: "",
    contactNumber: "",
    department: "",
    role: UserRolesEnumSchema.enum.user,
    username: "",
    password: "",
    confirmPassword: "",
  };
</script>

<script lang="ts">
  let { 
    mode = "create",
    invalid = $bindable(true), 
    formData = $bindable(defaultFormData),
    formBordered = true,
    onCancel = () => {},
    onCreateUser = () => {},
    onUpdateUser = () => {}
  }: Props = $props();

  const initialFormData: FormData = formData;

  let touched = $state<Record<keyof FormData, boolean>>(
    createInitialTouched(initialFormData)
  );

  let errors = $state<Partial<Record<keyof FormData, string>>>({});

  let birthdate = $state<DateValue | undefined>(undefined);

  let isFormTouched = $derived(Object.values(touched).some((value) => value === true));

  let todayDate = $state<DateValue | undefined>(
    fromDate(new Date(), getLocalTimeZone())
  );

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

  function handleSelectClose(field: "sex" | "department" | "role") {
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

  function handleSubmit() {
    validateFormData();
    markAllFieldsTouchedData();
    if (invalid) {
      return;
    }

    mode === "create" ? onCreateUser?.(formData) : onUpdateUser?.(formData);
  }
</script>

<form class="{formBordered ? "border border-border" : ""} rounded-md p-6 flex flex-col gap-4" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
  <FieldGroup class="grid grid-cols-3 gap-4">
    <Field>
      <FieldLabel for="rfid-number">
        <span>RFID #</span>
      </FieldLabel>
      <Input
        type="text"
        id="rfid-number"
        placeholder="Enter school ID number"
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
  </FieldGroup>

  <FieldGroup class="grid grid-cols-3 gap-4">
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
          {formData.sex === "male" ? "Male" : formData.sex === "female" ? "Female" : "Select Sex"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("sex")}
        <FieldError errors={[{ message: getFieldErrorMessage("sex") }]} />
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
        <span>Contact Number</span>
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
  </FieldGroup>

  <FieldGroup class="grid grid-cols-3 gap-4">
    <Field class="col-span-1">
      <FieldLabel for="birthdate">
        <span>Birthdate</span>
      </FieldLabel>
      <SelectCalendar
        id="birthdate"
        bind:value={birthdate}
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

    <Field class="col-span-1">
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

    <Field class="col-span-1">
      <FieldLabel for="role">
        <span>Role</span>
      </FieldLabel>
      <Select
        type="single"
        bind:value={formData.role}
        onOpenChange={(open) => {
          if (!open) {
            handleSelectClose("role");
          }
        }}
      >
        <SelectTrigger aria-invalid={hasFieldErrorMessage("role")}>
          {formData.role ? transformText(formData.role) : "Select Role"}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="department_staff">Department Staff</SelectItem>
          <SelectItem value="super_admin">Super Admin</SelectItem>
        </SelectContent>
      </Select>
      {#if getFieldErrorMessage("role")}
        <FieldError errors={[{ message: getFieldErrorMessage("role") }]} />
      {/if}
    </Field>
  </FieldGroup>

  {#if mode === "create"}
    <FieldSeparator class="my-4">Account Information</FieldSeparator>

    <FieldGroup class="grid grid-cols-3 gap-4">
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
    </FieldGroup>
  {/if}

  <FieldGroup class="flex flex-row justify-end gap-2 mt-6">
    <Field>
      <Button type="button" variant="outline" class="w-fit" onclick={onCancel}>Cancel</Button>
    </Field>
    <Field>
      {#if mode === "create"}
        <Button type="submit" variant="secondary" class="w-fit" disabled={invalid && isFormTouched}>
          Create User
        </Button>
      {:else}
        <Button type="submit" variant="secondary" class="w-fit" disabled={invalid && isFormTouched}>
          Update User
        </Button>
      {/if}
    </Field>
  </FieldGroup>
</form>