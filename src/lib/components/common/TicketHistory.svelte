<script lang="ts" module>
  export type Props = {
    ticketId: string;
  }
</script>

<script lang="ts">
	import { ticketsUpdatesActiveTicketIdStore, ticketsUpdatesStore, ticketUpdatesActions, ticketUpdatesLoadingStore } from "$lib/store/ticket-updates.store";
	import { cn } from "$lib/utils";
	import { Loader } from "@lucide/svelte";
	import { onMount } from "svelte";

  let { ticketId }: Props = $props();

	let ticketUpdates = $derived($ticketsUpdatesStore);
  let activeTicketId = $derived($ticketsUpdatesActiveTicketIdStore);
  let ticketUpdatesLoading = $derived($ticketUpdatesLoadingStore);
  let isActiveTicket = $derived(activeTicketId === ticketId);
  let isEmpty = $derived(ticketUpdates.length === 0);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${month} ${day} ${year} - ${hours}:${minutes} ${ampm}`;
  }

  onMount(() => {
    if (!isActiveTicket) {
      ticketUpdatesActions.getTicketsUpdates(ticketId, { page: 1, size: 20 });
    }
  });
</script>

{#if ticketUpdatesLoading}
	<div class="flex justify-center items-center h-full">
		<Loader class="size-4 animate-spin" />
    <span class="text-sm text-gray-500 ml-2">Loading...</span>
	</div>
{:else}
  {#if !isEmpty}
    <div class="flex flex-col p-1">
      {#each ticketUpdates as update, index (update.id)}
        {@const isFirst = index === 0}
        <div class="flex gap-4 relative">
          <div class="flex flex-col items-center relative">
            <div class={cn("size-3 rounded-full bg-gray-200 border-background z-1 shrink-0 mt-0.5", { "bg-blue-400 pulse-blue-shadow": isFirst })}></div>
            {#if index < ticketUpdates.length - 1}
              <div class="w-0.5 flex-1 bg-border min-h-8 absolute top-3 left-1.25 h-full"></div>
            {/if}
          </div>
          <div class="flex flex-col gap-1 pb-6 flex-1">
            <h3 class="text-xs font-semibold text-foreground m-0">{update.title}</h3>
            <p class="text-xs text-gray-700 m-0">{@html update.message}</p>
            <span class="text-xs text-muted-foreground mt-1">{formatDate(update.updated_at)}</span>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex justify-center items-center h-full">
      <span class="text-sm text-gray-500">No history found</span>
    </div>
  {/if}
{/if}

<style>
  .pulse-blue-shadow {
    animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse-blue {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.7);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(96, 165, 250, 0);
    }
  }
</style>