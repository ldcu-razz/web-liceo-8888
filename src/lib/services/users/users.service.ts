import { API_USERS, API_USERS_ID } from "$lib/constants";
import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
import type { Pagination } from "$lib/models/common/common.type";
import { UserRolesEnumSchema } from "$lib/models/users/users.schema";
import type { PaginatedUsers, PostUsers, PutUsers, Users } from "$lib/models/users/users.type";
import { getRouteWithParams } from "$lib/utils/routes.utils";

export async function getUsers(pagination: Pagination, q?: string): Promise<PaginatedUsers> {
  try {
    const url = new URL(API_USERS, window.location.origin);
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

export async function getUser(id: string): Promise<Users> {
  try {
    const result = await fetch(getRouteWithParams(API_USERS_ID, { id }));
    if (!result.ok) {
      throw new Error(result.statusText);
    }
    return result.json();
  }
  catch (error) {
    console.error(error);
    throw new Error((error as Error).message);
  }
}

export async function getNonMemberUsers(): Promise<PaginatedUsers> {
  try {
    const url = new URL(API_USERS, window.location.origin);
    url.searchParams.set('userRoles', UserRolesEnumSchema.enum.admin.toString() + ',' + UserRolesEnumSchema.enum.super_admin.toString() + ',' + UserRolesEnumSchema.enum.department_staff.toString());

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

export async function createUser(user: PostUsers): Promise<Users> {
  try {
    const result = await fetch(API_USERS, {
      method: 'POST',
      body: JSON.stringify(user),
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

export async function updateUser(id: string, user: PutUsers): Promise<Users> {
  try {
    const result = await fetch(getRouteWithParams(API_USERS_ID, { id }), {
      method: 'PUT',
      body: JSON.stringify(user),
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

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const result = await fetch(getRouteWithParams(API_USERS_ID, { id }), {
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

export async function archiveUser(id: string): Promise<boolean> {
  try {
    const result = await fetch(getRouteWithParams(API_USERS_ID, { id }), {
      method: 'PUT',
      body: JSON.stringify({ status: BaseStatusEnumSchema.enum.archived, updatedAt: new Date().toISOString() }),
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