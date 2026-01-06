<script lang="ts" module>
  export type Props = {
    options: {
      value: string;
      label: string;
    }[];
    value: string;
    noItemsMessage?: string;
    inputPlaceholder?: string;
    searchInputPlaceholder?: string;
  }
</script>

<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
	import { ChevronDownIcon } from "@lucide/svelte";
  
  let { options, value = $bindable(), noItemsMessage = "No items found", inputPlaceholder = "Select an item", searchInputPlaceholder = "Search" }: Props = $props();

  let triggerRef = $state<HTMLButtonElement>(null!);
  
  let selectedValue = $derived(
   options.find((o) => o.value === value)?.label
  );

  let open = $state(false);
  
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
   open = false;
   tick().then(() => {
    triggerRef.focus();
   });
  }

  function clear() {
   value = "";
   closeAndFocusTrigger();
  }
 </script>
  
 <Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
   {#snippet child({ props })}
    <Button
     {...props}
     variant="outline"
     class="w-full justify-between font-normal"
     role="combobox"
     aria-expanded={open}
    >
      {#if value}
        <span class="text-ellipsis overflow-hidden whitespace-nowrap">{selectedValue}</span>
      {:else}
        <span class="text-muted-foreground">{inputPlaceholder}</span>
      {/if}
     <ChevronDownIcon class="opacity-50" />
    </Button>
   {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
   <Command.Root>
    <Command.Input placeholder={searchInputPlaceholder} />
    <Command.List>
     <Command.Empty>{noItemsMessage}</Command.Empty>
     <Command.Group value="frameworks">
      {#each options as option (option.value)}
       <Command.Item
        value={option.value}
        onSelect={() => {
         value = option.value;
         closeAndFocusTrigger();
        }}
       >
        <CheckIcon
         class={cn(value !== option.value && "text-transparent")}
        />
        {option.label}
       </Command.Item>
      {/each}
     </Command.Group>
     <Command.Separator />
    </Command.List>
   </Command.Root>

   <div class="flex align-center">
    <Button variant="ghost" size="sm" class="w-full" onclick={clear}>
     Clear
    </Button>
   </div>
  </Popover.Content>
 </Popover.Root>