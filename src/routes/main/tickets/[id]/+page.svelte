<script lang="ts">
	import { onMount } from "svelte";
	import TicketsDetails from "../board/TicketsDetails.svelte";
	import { currentTicket, currentTicketLoading, ticketsActions } from "$lib/store/tickets.store";
	import { page } from "$app/state";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { TICKETS_BOARD } from "$lib/constants";
	import { goto } from "$app/navigation";
	import { meStore } from "$lib/store/me.store";
	import { UserRolesEnumSchema } from "$lib/models/users/users.schema";

  let ticket = $derived($currentTicket);

  let loading = $derived($currentTicketLoading);

  let me = $derived($meStore);
  let isMeRoleDepartmentStaff = $derived(me?.role === UserRolesEnumSchema.enum.department_staff);

  let disabledDeleteTicketButton = $derived(me?.role === UserRolesEnumSchema.enum.department_staff || me?.role === UserRolesEnumSchema.enum.user);

  onMount(async () => {
    if (!page.params.id) return;
    await ticketsActions.getTicket(page.params.id);
  });

  function goBackToTickets() {
    goto(TICKETS_BOARD);
  }
</script>

<div class="max-w-6xl mx-auto">
  {#if loading}
    <div class="flex flex-col gap-2">
      <Skeleton class="w-full h-32 rounded-md" />
      <Skeleton class="w-full h-24 rounded-md" />
    </div>
  {:else}
    <div class="mb-6">
      <Button variant="link" size="sm" class="p-0! text-gray-700" onclick={goBackToTickets}>
        <ArrowLeftIcon class="size-4" />
        Go back to tickets
      </Button>
    </div>
    {#if ticket}
      <TicketsDetails ticket={ticket} disabledDeleteTicketButton={disabledDeleteTicketButton} hideCloseButton={true} hideShareButton={true} close={() => {}} />
    {:else}
      <div class="flex justify-center items-center h-full">
        No ticket found
      </div>
    {/if}
  {/if}
</div>