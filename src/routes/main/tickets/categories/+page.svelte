<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import { PlusIcon, SearchIcon } from "@lucide/svelte";
	import { createTicketsCategoriesColumns } from "./columns";
	import type { PostTicketCategories, PutTicketCategories, TicketCategories } from "$lib/models/tickets/categories/tickets-categories.type";
	import TicketsCategoriesDataTable from "./TicketsCategoriesDataTable.svelte";
	import TicketCategoryForm, { defaultFormData, type FormData as TicketCategoryFormData, type Mode as TicketCategoryFormMode } from "./TicketsCategoryForm.svelte";
	import { ticketCategoriesActions, ticketCategoriesLoading, ticketCategoriesStore } from "$lib/store/ticket-categories.store";
	import { onMount } from "svelte";
	import { debounce } from "$lib/utils/reactive.utils";
	import { uuid } from "$lib/utils/uuid.util";
	import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";

  let loading = $derived($ticketCategoriesLoading);

  let categories = $derived($ticketCategoriesStore);

  let search = $state("");

  let showTicketCategoryFormSheet = $state(false);

  let activeTicketCategoryId: string | null = $state(null);

  let activeTicketCategory: TicketCategories | null = $derived(categories.find(c => c.id === activeTicketCategoryId) ?? null);

  let formMode: TicketCategoryFormMode = $state("create");

  let formData: TicketCategoryFormData = $state({ ...defaultFormData });

  let showDeleteTicketCategoryAlertDialog = $state(false);

  let isFirstMount = $state(true);

  const columns = $derived(createTicketsCategoriesColumns(handleViewTicketCategory, handleTicketCategoryArchive));

  const debouncedSearch = debounce((query: string) => {
    ticketCategoriesActions.getTicketCategories({ page: 1, size: 25 }, query);
  }, 500);

  $effect(() => {
    const query = search.trim();
    if (isFirstMount) {
      return;
    }
    
    debouncedSearch(query);
  });

  onMount(() => {
    isFirstMount = false;
  });
  
  function handleAddTicketCategory() {
    formData = { ...defaultFormData };
    formMode = "create";
    showTicketCategoryFormSheet = true;
  }

  function handleViewTicketCategory(id: string) {
    formMode = "update";
    activeTicketCategoryId = id;
    activeTicketCategory = categories.find(c => c.id === id) ?? null;
    if (activeTicketCategory) {
      showTicketCategoryFormSheet = true;
    }    
    formData = {
      ...defaultFormData,
      ...(activeTicketCategory && {
        name: activeTicketCategory.name,
        department_id: activeTicketCategory.department_id,
        status: activeTicketCategory.status as TicketCategoryFormData["status"],
      }),
    };
  }

  function handleTicketCategoryArchive(id: string) {
    activeTicketCategoryId = id;
    showDeleteTicketCategoryAlertDialog = true;
  }

  function handleSubmitTicketCategoryForm(formData: TicketCategoryFormData) {
    if (formMode === "create") {
      const payload: PostTicketCategories = {
        id: uuid(),
        name: formData.name,
        department_id: formData.department_id,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ticketCategoriesActions.createTicketCategory(payload);
    } else {
      if (activeTicketCategoryId) {
        const payload: PutTicketCategories = {
          id: activeTicketCategoryId,
          name: formData.name,
          department_id: formData.department_id,
          status: formData.status,
          updatedAt: new Date().toISOString(),
        };
        ticketCategoriesActions.updateTicketCategory(activeTicketCategoryId, payload);
      }
    }

    showTicketCategoryFormSheet = false;
  }

  function handleArchiveTicketCategory() {
    if (activeTicketCategoryId) {
      ticketCategoriesActions.archiveTicketCategory(activeTicketCategoryId);
    }

    showDeleteTicketCategoryAlertDialog = false;
    activeTicketCategoryId = null;
  }

  function handleCancelTicketCategoryForm() {
    showTicketCategoryFormSheet = false;
  }
</script>

<div class="flex flex-col gap-4 container mx-auto">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-semibold">Categories</h1>
      <InputGroup>
        <InputGroupInput bind:value={search} placeholder="Search by name" />
        <InputGroupAddon>
          <SearchIcon class="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>

    <Sheet bind:open={showTicketCategoryFormSheet}>
      <SheetTrigger>
        <Button variant="secondary" onclick={handleAddTicketCategory}>
          <PlusIcon class="size-4" />
          Add Category
        </Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{formMode === "create" ? "Add Category" : "Edit Category"}</SheetTitle>
            <SheetDescription>{formMode === "create" ? "Add a new ticket category to the system." : "Edit the ticket category information."}</SheetDescription>
          </SheetHeader>
          <TicketCategoryForm bind:formData={formData} onSubmit={handleSubmitTicketCategoryForm} onCancel={handleCancelTicketCategoryForm} />
        </SheetContent>
      </SheetTrigger>
    </Sheet>
  </div>

  <TicketsCategoriesDataTable {columns} data={categories} {loading} />
</div>

<AlertDialog bind:open={showDeleteTicketCategoryAlertDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to archive the ticket category {activeTicketCategory?.name}?</AlertDialogTitle>
      <AlertDialogDescription>Archiving this ticket category will remove it from the system.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleArchiveTicketCategory}>Archive</Button>
      <Button variant="outline" onclick={() => showDeleteTicketCategoryAlertDialog = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>