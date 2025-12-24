import { API_DEPARTMENTS, API_DEPARTMENTS_ID } from "$lib/constants";
import type { Departments } from "$lib/models/departments/departments.type";
import { getRouteWithParams } from "$lib/utils/routes.utils";

export async function getDepartments() {
  try {
    const result = await fetch(API_DEPARTMENTS);
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }
}

export async function createDepartment(department: Departments) {
  try {
    const result = await fetch(API_DEPARTMENTS, {
      method: 'POST',
      body: JSON.stringify(department),
    });

    if (!result.ok) {
      throw new Error(result.statusText);
    }

    return result.json();
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }
}

export async function updateDepartment(id: string,department: Partial<Departments>) {
  try {
    const result = await fetch(getRouteWithParams(API_DEPARTMENTS_ID, { id }), {
      method: 'PUT',
      body: JSON.stringify(department),
    });

    if (!result.ok) {
      throw new Error(result.statusText);
    }

    return result.json();
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }
}

export async function archiveDepartment(id: string) {
  try {
    const result = await fetch(`/api/departments/${id}`, {
      method: 'DELETE',
    });

    if (!result.ok) {
      throw new Error(result.statusText);
    }
  } catch (error) {
    console.error(error);
    return { error: (error as Error).message };
  }
}