<script lang="ts">
	import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
	import Calendar from "$lib/components/ui/calendar/calendar.svelte";
	import { getLocalTimeZone, DateFormatter, type DateValue } from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	type Props = {
		value?: DateValue | undefined;
		placeholder?: string;
		id?: string;
		"aria-invalid"?: boolean | "false" | "true";
		disabled?: boolean;
		buttonClass?: string;
		popoverContentClass?: string;
		calendarClass?: string;
		captionLayout?: ComponentProps<typeof Calendar>["captionLayout"];
		locale?: string;
		dateFormat?: Intl.DateTimeFormatOptions;
		onOpenChange?: (open: boolean) => void;
		onValueChange?: (value: DateValue | undefined) => void;
	} & Omit<ComponentProps<typeof Calendar>, "value" | "class" | "captionLayout" | "locale">;

	let {
		value = $bindable(),
		placeholder = "Select date",
		id,
		"aria-invalid": ariaInvalid,
		disabled = false,
		buttonClass,
		popoverContentClass,
		calendarClass,
		captionLayout = "dropdown",
		locale = "en-US",
		dateFormat = {
			year: "numeric",
			month: "long",
			day: "numeric"
		},
		onOpenChange,
		onValueChange,
		...calendarProps
	}: Props = $props();

	let popoverOpen = $state(false);

	function formatDate(date: DateValue | undefined): string {
		if (!date) return "";
		const dateObj = date.toDate(getLocalTimeZone());
		const formatter = new DateFormatter(locale, dateFormat);
		return formatter.format(dateObj);
	}

	function handleOpenChange(open: boolean) {
		popoverOpen = open;
		onOpenChange?.(open);
	}

	// Track previous value to detect changes and prevent loops
	let previousValue = $state<DateValue | undefined>(value);

	$effect(() => {
		// Only trigger callbacks if value actually changed
		if (value !== previousValue) {
			const newValue = value;
			previousValue = newValue;
			
			if (newValue) {
				popoverOpen = false;
			}
			
			// Call callback after updating previousValue to prevent loops
			if (onValueChange) {
				onValueChange(newValue);
			}
		}
	});

	const defaultButtonClass = $derived(
		cn(
			"flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-base shadow-xs ring-offset-background transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 text-left justify-start",
			popoverOpen && ariaInvalid !== true && ariaInvalid !== "true"
				? "border-ring ring-[3px] ring-ring/50"
				: "",
			ariaInvalid === true || ariaInvalid === "true"
				? "border-destructive ring-destructive/20 dark:ring-destructive/40"
				: "",
			buttonClass
		)
	);
</script>

<Popover bind:open={popoverOpen} onOpenChange={handleOpenChange}>
	<PopoverTrigger>
		<button
			type="button"
			{id}
			disabled={disabled}
			class={defaultButtonClass}
		>
			<span class={formatDate(value) ? "" : "text-muted-foreground"}>
				{formatDate(value) || placeholder}
			</span>
		</button>
	</PopoverTrigger>
	<PopoverContent class={cn("w-auto p-0", popoverContentClass)}>
		<Calendar
			type="single"
			bind:value={value}
			{captionLayout}
			{locale}
			class={cn(calendarClass)}
			{...calendarProps}
		/>
	</PopoverContent>
</Popover>

