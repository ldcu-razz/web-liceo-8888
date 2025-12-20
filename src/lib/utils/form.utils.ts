import type { z } from "zod";

/**
 * Validates the entire form using a Zod schema
 */
export function validateForm<T extends Record<string, unknown>>(
	formData: T,
	schema: z.ZodSchema<T>
): { errors: Partial<Record<keyof T, string>>; invalid: boolean } {
	const result = schema.safeParse(formData);

	if (!result.success) {
		const fieldErrors: Partial<Record<keyof T, string>> = {};
		result.error.issues.forEach((error: z.ZodIssue) => {
			const field = error.path[0] as keyof T;
			fieldErrors[field] = error.message;
		});
		return { errors: fieldErrors, invalid: true };
	}

	return { errors: {}, invalid: false };
}

/**
 * Validates a single field using a Zod schema
 */
export function validateField<T extends Record<string, unknown>>(
	field: keyof T,
	formData: T,
	schema: z.ZodSchema<T>,
	currentErrors: Partial<Record<keyof T, string>>
): { errors: Partial<Record<keyof T, string>>; invalid: boolean } {
	const result = schema.safeParse(formData);

	let updatedErrors: Partial<Record<keyof T, string>>;

	if (!result.success) {
		const fieldError = result.error.issues.find((e: z.ZodIssue) => e.path[0] === field);
		if (fieldError) {
			updatedErrors = { ...currentErrors, [field]: fieldError.message };
		} else {
			// Remove the field from errors if it's now valid
			updatedErrors = { ...currentErrors };
			delete updatedErrors[field];
		}
	} else {
		// Remove the field from errors if form is valid
		updatedErrors = { ...currentErrors };
		delete updatedErrors[field];
	}

	const hasErrors = Object.keys(updatedErrors).length > 0;
	return { errors: updatedErrors, invalid: hasErrors };
}

/**
 * Gets error message for a field (only if touched)
 */
export function getFieldError<T extends Record<string, unknown>>(
	field: keyof T,
	touched: Record<keyof T, boolean>,
	errors: Partial<Record<keyof T, string>>
): string | undefined {
	return touched[field] ? errors[field] : undefined;
}

/**
 * Checks if a field has an error (only if touched)
 */
export function hasFieldError<T extends Record<string, unknown>>(
	field: keyof T,
	touched: Record<keyof T, boolean>,
	errors: Partial<Record<keyof T, string>>
): boolean {
	return touched[field] && !!errors[field];
}

/**
 * Creates initial touched state with all fields set to false
 */
export function createInitialTouched<T extends Record<string, unknown>>(
	initialData: T
): Record<keyof T, boolean> {
	const touched = {} as Record<keyof T, boolean>;
	Object.keys(initialData).forEach((key) => {
		touched[key as keyof T] = false;
	});
	return touched;
}

/**
 * Marks all fields as touched
 */
export function markAllFieldsTouched<T extends Record<string, unknown>>(
	initialData: T
): Record<keyof T, boolean> {
	const touched = {} as Record<keyof T, boolean>;
	Object.keys(initialData).forEach((key) => {
		touched[key as keyof T] = true;
	});
	return touched;
}

