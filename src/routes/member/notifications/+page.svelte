<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { notificationsActions, notificationsCountStore, notificationsLoadingStore, notificationsPaginationStore, notificationsStore } from "$lib/store/notifications.store";
	import AppBar from "../AppBar.svelte";
	import NotificationItem from "$lib/components/common/notifications/NotificaionItem.svelte";
	import { MEMBER_TICKETS_ID } from "$lib";
	import { getRoute } from "$lib/utils/routes.utils";
	import { goto } from "$app/navigation";
	import { meStore } from "$lib/store/me.store";
	import { Button } from "$lib/components/ui/button";
	import { ArrowDownIcon, LoaderIcon } from "@lucide/svelte";

  let notifications = $derived($notificationsStore);

  let notificationsCount = $derived($notificationsCountStore);

  let notificationsIsEmpty = $derived(notifications.length === 0);

  let loading = $derived($notificationsLoadingStore);

  let pagination = $derived($notificationsPaginationStore);

  let loadingMoreNotifications = $state(false);

  let isReachedToMaxNotificationsLimit = $derived(pagination.size >= notificationsCount);

  let me = $derived($meStore);

  function handleOnTicketNotificationClick(id: string) {
    goto(getRoute(MEMBER_TICKETS_ID, { id }));
  }

  async function handleShowMoreNotifications() {
    if (isReachedToMaxNotificationsLimit) {
      return;
    }
    loadingMoreNotifications = true;
    const newPagination = { ...pagination, size: pagination.size + 20 };
    await notificationsActions.getNotifications(newPagination, me?.id ?? '', true);
    notificationsPaginationStore.set(newPagination);
    loadingMoreNotifications = false;
  }
</script>

<section class="relative px-4">
	<AppBar title="Notifications" backButton={false} />

  <div style="margin-top: 3.5rem;">
    {#if loading}
      <div class="lex flex-col gap-4">
        <Skeleton class="h-42 w-full rounded-md" />
        <Skeleton class="h-20 w-full rounded-md" />
        <Skeleton class="h-20 w-full rounded-md" />
      </div>
    {:else if notificationsIsEmpty}
      <div class="lex flex-col gap-2">
        <p class="text-gray-500">No notifications</p>
      </div>
    {:else}
      <div class="flex flex-col">
        {#each notifications as notification}
          <div class="-mx-4 bg-white border-b border-border">
            <NotificationItem {notification} onTicketClick={handleOnTicketNotificationClick} />
          </div>
        {/each}

        {#if !isReachedToMaxNotificationsLimit}
          <div class="flex justify-center">
            <Button variant="outline" class="mt-4 w-fit" disabled={loadingMoreNotifications} onclick={handleShowMoreNotifications}>
              {#if loadingMoreNotifications}
                <LoaderIcon class="size-4 animate-spin" />
              {:else}
                <ArrowDownIcon class="size-4" />
              {/if}
              Show More
            </Button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>