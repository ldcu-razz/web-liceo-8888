<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import { PlusIcon, SearchIcon } from "@lucide/svelte";
	import { createComplaintsCategoriesColumns } from "./columns";
	import type { ComplaintsCategories } from "$lib/models/complaints/categories/complaints-categories.type";
	import ComplaintsCategoriesDataTable from "./ComplaintsCategoriesDataTable.svelte";
	import ComplaintCategoryForm, { defaultFormData, type FormData as ComplaintCategoryFormData, type Mode as ComplaintCategoryFormMode } from "./ComplainCategoryForm.svelte";

  let data: ComplaintsCategories[] = $state([
    {
      id: "1",
      name: "Category 1",
      default_department: "1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Category 2",
      default_department: "2",
      status: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Category 3",
      default_department: "3",
      status: "archived",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  let search = $state("");

  let showComplaintCategoryFormSheet = $state(false);

  let activeComplaintCategoryId: string | null = $state(null);

  let activeComplaintCategory: ComplaintsCategories | null = $derived(data.find(c => c.id === activeComplaintCategoryId) ?? null);

  let formMode: ComplaintCategoryFormMode = $state("create");

  let formData: ComplaintCategoryFormData = $state({ ...defaultFormData });

  const columns = $derived(createComplaintsCategoriesColumns(handleViewComplaintCategory, handleComplaintCategoryDelete));

  function handleAddComplaintCategory() {
    formData = { ...defaultFormData };
    formMode = "create";
    showComplaintCategoryFormSheet = true;
  }

  function handleViewComplaintCategory(id: string) {
    formMode = "update";
    activeComplaintCategoryId = id;
    activeComplaintCategory = data.find(c => c.id === id) ?? null;
    if (activeComplaintCategory) {
      showComplaintCategoryFormSheet = true;
    }    
    formData = {
      ...defaultFormData,
      ...(activeComplaintCategory && {
        name: activeComplaintCategory.name,
        default_department: activeComplaintCategory.default_department,
        status: activeComplaintCategory.status as ComplaintCategoryFormData["status"],
      }),
    };
  }

  function handleComplaintCategoryDelete(id: string) {
    console.log(id);
  }

  function handleSubmitComplaintCategoryForm(formData: ComplaintCategoryFormData) {
    console.log(formData);
  }

  function handleCancelComplaintCategoryForm() {
    showComplaintCategoryFormSheet = false;
  }
</script>

<div class="flex flex-col gap-4 container mx-auto">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-semibold">Departments</h1>
      <InputGroup>
        <InputGroupInput bind:value={search} placeholder="Search by name" />
        <InputGroupAddon>
          <SearchIcon class="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>

    <Sheet bind:open={showComplaintCategoryFormSheet}>
      <SheetTrigger>
        <Button variant="secondary" onclick={handleAddComplaintCategory}>
          <PlusIcon class="size-4" />
          Add Category
        </Button>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{formMode === "create" ? "Add Category" : "Edit Category"}</SheetTitle>
            <SheetDescription>{formMode === "create" ? "Add a new complaint category to the system." : "Edit the complaint category information."}</SheetDescription>
          </SheetHeader>
          <ComplaintCategoryForm bind:formData={formData} onSubmit={handleSubmitComplaintCategoryForm} onCancel={handleCancelComplaintCategoryForm} />
        </SheetContent>
      </SheetTrigger>
    </Sheet>
  </div>

  <ComplaintsCategoriesDataTable {columns} {data} />
</div>