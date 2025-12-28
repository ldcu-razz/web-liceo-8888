<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import type { Users } from "$lib/models/users/users.type";
	import { PlusIcon, SearchIcon } from "@lucide/svelte";
	import { createUsersTableColumns } from "./columns";
	import UsersDataTable from "./UsersDataTable.svelte";
	import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";
	import { goto } from "$app/navigation";
	import { getRoute } from "$lib/utils/routes.utils";
	import { CREATE_USER, USER_DETAILS } from "$lib/constants";
	import { hasUsersData, usersActions, usersLoading, usersStore } from "$lib/store/users.store";
	import { onMount } from "svelte";
	import { debounce } from "$lib/utils/reactive.utils";

  let data = $derived($usersStore);

  let search = $state("");
  let showDeleteUserAlertDialog = $state(false);
  let activeUserId: string | null = $state(null);
  let activeUser: Users | null = $derived(data.find(u => u.id === activeUserId) ?? null);
  let hasUsersDataLoaded = $derived($hasUsersData);

  let loading = $derived($usersLoading);

  let isFirstMount = $state(true);

  const columns = $derived(createUsersTableColumns(handleUserView, handleUserArchive));

  const debouncedSearch = debounce(({ query }: { query: string }) => {
    const silentLoading = hasUsersDataLoaded && !query;
    usersActions.getUsers({ page: 1, size: 25 }, query, silentLoading);
  }, 600);

  $effect(() => {
    if (isFirstMount) {
      return;
    }
    
    debouncedSearch({ query: search });
  });

  onMount(async () => {
    isFirstMount = false;
  });

  function handleAddUserClick() {
    goto(CREATE_USER);
  }

  function handleUserView(id: string) {
    goto(getRoute(USER_DETAILS, { id }));
  }

  function handleUserArchive(id: string) {
    activeUserId = id;
    showDeleteUserAlertDialog = true;
  }

  function handleArchiveUser() {
    if (activeUserId) {
      usersActions.archiveUser(activeUserId);
    }

    showDeleteUserAlertDialog = false;
    activeUserId = null;
  }
</script>


<div class="flex flex-col gap-4 container mx-auto">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-semibold">Users</h1>
      <InputGroup>
        <InputGroupInput bind:value={search} placeholder="Search by name, RFID" />
        <InputGroupAddon>
          <SearchIcon class="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
    <Button variant="secondary" onclick={handleAddUserClick}>
      <PlusIcon class="size-4" />
      Add User
    </Button>
  </div>

  <UsersDataTable {loading} {columns} {data} />
</div>

<AlertDialog bind:open={showDeleteUserAlertDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to archive the user {activeUser?.firstname} {activeUser?.lastname}?</AlertDialogTitle>
      <AlertDialogDescription>Archiving this user will not be used in the system.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleArchiveUser}>Archive</Button>
      <Button variant="outline" onclick={() => showDeleteUserAlertDialog = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>