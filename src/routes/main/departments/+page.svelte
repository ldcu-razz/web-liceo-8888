<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { PlusIcon, SearchIcon } from "@lucide/svelte";
	import DeaprtmentsDataTable from "./DeaprtmentsDataTable.svelte";
	import { createColumns } from "./columns";
	import type { Departments } from "$lib/models/departments/departments.type";
	import { InputGroup, InputGroupAddon, InputGroupInput } from "$lib/components/ui/input-group";
	import Sheet from "$lib/components/ui/sheet/sheet.svelte";
	import { SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "$lib/components/ui/sheet";
	import DepartmentForm, { type FormData, defaultFormData } from "./DepartmentForm.svelte";
	import AlertDialog from "$lib/components/ui/alert-dialog/alert-dialog.svelte";
	import AlertDialogContent from "$lib/components/ui/alert-dialog/alert-dialog-content.svelte";
	import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "$lib/components/ui/alert-dialog";

  let data: Departments[] = $state([
    {
      id: "1",
      name: "Department 1",
      abbv: "D1",
      description: "Description 1",
      keywords: ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5", "Keyword 6", "Keyword 7", "Keyword 8", "Keyword 9", "Keyword 10"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Department 2",
      abbv: "D2",
      description: "Description 2",
      keywords: ["Keyword 3", "Keyword 4"],
      status: "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Department 3",
      abbv: "D3",
      description: "Description 3",
      keywords: ["Keyword 5", "Keyword 6"],
      status: "archived",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  let search = $state("");
  let showDepartmentFormSheet = $state(false);
  let activeDepartmentId: string | null = $state(null);
  let activeDepartment: Departments | null = $derived(data.find(d => d.id === activeDepartmentId) ?? null);
  let showDeleteDepartmentAlertDialog = $state(false);

  let formData: FormData = $state({ ...defaultFormData });

  const columns = $derived(createColumns(handleView, handleDelete));

  // Reset form when sheet opens in add mode or closes
  $effect(() => {
    if (!showDepartmentFormSheet) {
      activeDepartmentId = null;
      formData = { ...defaultFormData };
    } else if (showDepartmentFormSheet && !activeDepartmentId) {
      formData = { ...defaultFormData };
    }
  });

  function handleView(id: string) {
    const department = data.find(d => d.id === id);
    if (department) {
      activeDepartmentId = id;
      formData = {
        name: department.name,
        abbreviation: department.abbv,
        description: department.description || "",
        keywords: department.keywords || [],
        status: department.status,
      };
      showDepartmentFormSheet = true;
    }
  }

  function handleDelete(id: string) {
    activeDepartmentId = id;
    showDeleteDepartmentAlertDialog = true;
  }

  function handleCancelDepartmentForm() {
    showDepartmentFormSheet = false;
    activeDepartmentId = null;
    formData = { ...defaultFormData };
  }

  function handleSubmitDepartmentForm(submittedFormData: FormData) {
    if (activeDepartmentId) {
      const index = data.findIndex(d => d.id === activeDepartmentId);
      if (index !== -1) {
        data[index] = {
          ...data[index],
          name: submittedFormData.name,
          abbv: submittedFormData.abbreviation,
          description: submittedFormData.description,
          keywords: submittedFormData.keywords,
          status: submittedFormData.status,
          updatedAt: new Date().toISOString(),
        };
      }
    } else {
      const newDepartment: Departments = {
        id: String(Date.now()),
        name: submittedFormData.name,
        abbv: submittedFormData.abbreviation,
        description: submittedFormData.description,
        keywords: submittedFormData.keywords,
        status: submittedFormData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data = [...data, newDepartment];
    }

    handleCancelDepartmentForm();
  }

  function handleDeleteDepartment() {
    showDeleteDepartmentAlertDialog = false;
  }
</script>

<div class="flex flex-col gap-4 container mx-auto">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-semibold">Departments</h1>
      <InputGroup>
        <InputGroupInput bind:value={search} placeholder="Search by name, abbv." />
        <InputGroupAddon>
          <SearchIcon class="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
    <Sheet bind:open={showDepartmentFormSheet}>
      <SheetTrigger>
        <Button variant="secondary">
          <PlusIcon class="size-4" />
          Add Department
        </Button>
      </SheetTrigger>
      <SheetContent class="min-w-lg" interactOutsideBehavior="ignore">
        <SheetHeader>
          <SheetTitle>{activeDepartmentId ? "Edit Department" : "Add Department"}</SheetTitle>
          <SheetDescription>
            {activeDepartmentId ? "Update the department information." : "Add a new department to the system."}
          </SheetDescription>
        </SheetHeader>
        <div class="px-4">
          <DepartmentForm bind:formData={formData} onSubmit={handleSubmitDepartmentForm} onCancel={handleCancelDepartmentForm} />
        </div>
      </SheetContent>
    </Sheet>
  </div>
  
  <DeaprtmentsDataTable {columns} {data} />
</div>

<AlertDialog bind:open={showDeleteDepartmentAlertDialog}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure to delete the department {activeDepartment?.name}?</AlertDialogTitle>
      <AlertDialogDescription>Deleting this department will remove all related data.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <Button variant="destructive" onclick={handleDeleteDepartment}>Delete</Button>
      <Button variant="outline" onclick={() => showDeleteDepartmentAlertDialog = false}>Cancel</Button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>