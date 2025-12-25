import { derived, get, writable } from "svelte/store";
import type { Departments } from "$lib/models/departments/departments.type";
import { createDepartment, archiveDepartment, getDepartments, updateDepartment } from "$lib/services/departments/departments.services";
import { toast } from "svelte-sonner";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
import type { Pagination } from "$lib/models/common/common.type";

export const departmentsStore = writable<Departments[]>([]);
export const departmentsLoading = writable(false);
export const departmentsError = writable<string | null>(null);
export const departmentsPagination = writable<Pagination>({ page: 1, size: 25 });
export const departmentsTotalCount = writable<number>(0);

export const hasDepartmentsLoaded = derived(departmentsStore, ($departmentsStore) => $departmentsStore.length > 0);

export const departmentsMap = derived(departmentsStore, ($departmentsStore) => {
  return $departmentsStore.reduce((acc, department) => {
    acc[department.id] = department;
    return acc;
  }, {} as Record<string, Departments>);
});

export const departmentsActions = {
  getDepartments: async ( pagination: Pagination, q?: string, silentLoading?: boolean) => {
    try {
      if (!silentLoading) {
        departmentsLoading.set(true);
      }

      departmentsPagination.set(pagination);

      const data = await getDepartments(pagination, q);

      departmentsLoading.set(false);
      departmentsStore.set(data.data);
      departmentsPagination.update(prev => ({ ...prev, page: pagination.page, size: pagination.size }));
      departmentsTotalCount.update(() => data.count);
    } catch (error) {
      console.error(error);
      departmentsError.set((error as Error).message);
      departmentsLoading.set(false);
    }
  },
  
  createDepartment: async (department: Departments) => {
    const toastId = toast.loading(`Creating department...`);
    try {
      departmentsStore.set([department, ...get(departmentsStore) || []]);
      await createDepartment(department);
      toast.success(`Department created successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      departmentsStore.set(get(departmentsStore).filter(d => d.id !== department.id));
      toast.error(`Failed to create department`, { id: toastId });
    }
  },

  updateDepartment: async (id: string, department: Partial<Departments>) => {
    const toastId = toast.loading(`Updating department...`);
    const currentDepartment = get(departmentsStore).find(d => d.id === id);
    try {
      departmentsStore.set(get(departmentsStore).map(d => d.id === id ? {...d, ...department} : d));
      await updateDepartment(id, department);
      toast.success(`Department updated successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentDepartment) {
        departmentsStore.set(get(departmentsStore).map(d => d.id === id ? {...currentDepartment} : d));
      }
      toast.error(`Failed to update department`, { id: toastId });
    }
  },

  archiveDepartment: async (id: string) => {
    const toastId = toast.loading(`Archiving department...`);
    const currentDeletedDepartment = get(departmentsStore).find(d => d.id === id);
    try {
      const updatedDepartments = get(departmentsStore).map(d => d.id === id ? { ...d, status: BaseStatusEnumSchema.enum.archived } : d);
      await archiveDepartment(id);
      departmentsStore.set(updatedDepartments);
      toast.success(`Department archived successfully`, { id: toastId });
    } catch (error) {
      console.error(error);
      if (currentDeletedDepartment) {
        departmentsStore.set(get(departmentsStore).map(d => d.id === id ? {...currentDeletedDepartment} : d));
      }
      toast.error(`Failed to archive department`, { id: toastId });
    }
  },
}