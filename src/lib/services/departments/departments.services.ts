import { API_DEPARTMENTS, API_DEPARTMENTS_ID } from "$lib/constants";
import type { Pagination } from "$lib/models/common/common.type";
import type { Departments, PaginatedDepartments } from "$lib/models/departments/departments.type";
import { getRouteWithParams } from "$lib/utils/routes.utils";

export async function getDepartments(pagination: Pagination, q?: string): Promise<PaginatedDepartments> {
  try {
    const url = new URL(API_DEPARTMENTS, window.location.origin);
    url.searchParams.set('page', pagination.page.toString());
    url.searchParams.set('size', pagination.size.toString());
    if (q) {
      url.searchParams.set('q', q);
    }
    
    const result = await fetch(url.toString());
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export async function createDepartment(department: Departments): Promise<Departments> {
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
    throw new Error((error as Error).message);
  }
}

export async function updateDepartment(id: string,department: Partial<Departments>): Promise<Departments> {
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
    throw new Error((error as Error).message);
  }
}

export async function archiveDepartment(id: string): Promise<boolean> {
  try {
    const result = await fetch(`/api/departments/${id}`, {
      method: 'DELETE',
    });

    if (!result.ok) {
      throw new Error(result.statusText);
    }

    return result.json();
  } catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}