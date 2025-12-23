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


  let data: Users[] = $state([
    {
      id: "1",
      rfid_number: "1234567890",
      firstname: "John",
      lastname: "Doe",
      sex: "male",
      birthdate: "1990-01-01",
      email: "john.doe@example.com",
      contact_number: "1234567890",
      username: "john.doe",
      password: "password",
      role: "user",
      department_id: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      rfid_number: "1234567890",
      firstname: "Jane",
      lastname: "Doe",
      sex: "female",
      birthdate: "1990-01-01",
      email: "jane.doe@example.com",
      contact_number: "1234567890",
      username: "jane.doe",
      password: "password",
      role: "super_admin",
      department_id: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      rfid_number: "1234567890",
      firstname: "Jim",
      lastname: "Beam",
      sex: "male",
      birthdate: "1990-01-01",
      email: "jim.beam@example.com",
      contact_number: "1234567890",
      username: "jim.beam",
      password: "password",
      role: "user",
      department_id: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  let search = $state("");
  let showDeleteUserAlertDialog = $state(false);
  let activeUserId: string | null = $state(null);
  let activeUser: Users | null = $derived(data.find(u => u.id === activeUserId) ?? null);

  const columns = $derived(createUsersTableColumns(handleUserView, handleUserDelete));

  function handleAddUserClick() {
    goto(CREATE_USER);
  }

  function handleUserView(id: string) {
    goto(getRoute(USER_DETAILS, { id }));
  }

  function handleUserDelete(id: string) {
    activeUserId = id;
    showDeleteUserAlertDialog = true;
  }

  function handleDeleteUser() {
    console.log(activeUserId);
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

  <UsersDataTable {columns} {data} />
</div>

<AlertDialog bind:open={showDeleteUserAlertDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to delete the user {activeUser?.firstname} {activeUser?.lastname}?</AlertDialogTitle>
      <AlertDialogDescription>Deleting this user will remove all related data.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleDeleteUser}>Delete</Button>
      <Button variant="outline" onclick={() => showDeleteUserAlertDialog = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>