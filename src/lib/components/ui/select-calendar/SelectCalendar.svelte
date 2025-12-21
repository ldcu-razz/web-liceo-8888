<script lang="ts">
	import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
	import Calendar from "$lib/components/ui/calendar/calendar.svelte";
	import {
		InputGroup,
		InputGroupInput,
	} from "$lib/components/ui/input-group";
	import { Calendar as CalendarIcon } from "@lucide/svelte";
	import { getLocalTimeZone, DateFormatter, type DateValue } from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";
	import InputGroupAddon from "../input-group/input-group-addon.svelte";

	type Props = {
		value?: DateValue | undefined;
		placeholder?: string;
		id?: string;
		"aria-invalid"?: boolean | "false" | "true";
		disabled?: boolean;
		buttonClass?: string;
		inputClass?: string;
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
		placeholder = "",
		id,
		"aria-invalid": ariaInvalid,
		disabled = false,
		buttonClass,
		inputClass,
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

	const formattedValue = $derived(formatDate(value));

	const defaultInputGroupClass = $derived(
		cn(
			"cursor-pointer",
			popoverOpen && ariaInvalid !== true && ariaInvalid !== "true"
				? "border-ring ring-[3px] ring-ring/50"
				: "",
			buttonClass, // Keep for backward compatibility
			inputClass
		)
	);
</script>

<Popover bind:open={popoverOpen} onOpenChange={handleOpenChange}>
	<PopoverTrigger>
		<InputGroup class={defaultInputGroupClass} aria-invalid={ariaInvalid}>
			<InputGroupInput
				{id}
				readonly
				disabled={disabled}
				aria-invalid={ariaInvalid}
				value={formattedValue}
				placeholder={placeholder}
			/>
			<InputGroupAddon>
				<CalendarIcon />
			</InputGroupAddon>
		</InputGroup>
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

