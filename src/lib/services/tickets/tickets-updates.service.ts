import { API_TICKETS_UPDATES } from "$lib/constants/routes.constants";
import type { Pagination } from "$lib/models/common/common.type";
import type { GetTicketsUpdates, GetTicketsUpdatesPaginated, PostTicketsUpdates } from "$lib/models/tickets/tickets-updates.type";
import type { TicketsPriorities, TicketStatuses } from "$lib/models/tickets/tickets.type";
import { departmentsMap } from "$lib/store/departments.store";
import { allUsersMap } from "$lib/store/users.store";
import { getRoute } from "$lib/utils/routes.utils";
import { transformText } from "$lib/utils/texts.utils";
import { get } from "svelte/store";

export const getTicketsUpdates = async (pagination?: Pagination, ticketId?: string): Promise<GetTicketsUpdatesPaginated> => {
  const url = new URL(getRoute(API_TICKETS_UPDATES, {}), window.location.origin);
  if (pagination) {
    url.searchParams.set('page', pagination.page.toString());
    url.searchParams.set('size', pagination.size.toString());
  }
  if (ticketId) url.searchParams.set('ticketId', ticketId);
  const result = await fetch(url.toString());
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
}

export const postTicketsUpdates = async (body: PostTicketsUpdates): Promise<GetTicketsUpdates> => {
  const url = new URL(getRoute(API_TICKETS_UPDATES, {}), window.location.origin);
  const result = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!result.ok) {
    throw new Error(result.statusText);
  }
  return result.json();
}


export const getCreateTicketTitle = async (): Promise<string> => {
  return `Ticket Created`;
}

export const getCreateTicketRemarkMessage = async (createdById: string): Promise<string> => {
  const usersMapData = get(allUsersMap);
  const createdBy = usersMapData[createdById];
  const createdByFullName = `${createdBy?.firstname} ${createdBy?.lastname}`;
  return `<span style="font-weight: 600;">${createdByFullName}</span> created the ticket.`;
}

export const getDepartmentAssignTitle = async (): Promise<string> => {
  return `Department Assigned`;
}

export const getDepartmentAssignRemarkMessage = async (departmentId: string, assignedById: string): Promise<string> => {
  const departmentsMapData = get(departmentsMap);
  const department = departmentsMapData[departmentId];
  const departmentFullName = `${department?.name}`;

  const usersMapData = get(allUsersMap);
  const assignedBy = usersMapData[assignedById];
  const assignedByFullName = `${assignedBy?.firstname} ${assignedBy?.lastname}`;

  let message = '';

  if (department) {
    message = `<span style="font-weight: 600;">${assignedByFullName}</span> assigned the ticket to <span style="font-weight: 600;">${departmentFullName}</span>`;
  } else {
    message = `<span style="font-weight: 600;">${assignedByFullName}</span> unassigned the ticket from the department.`;
  }
  
  return message;
}

export const getUserAssignTitle = async (): Promise<string> => {
  return `User Assigned`;
}

export const getUserAssignRemarkMessage = async (userId: string, assignedById: string): Promise<string> => {
  const usersMap = get(allUsersMap);

  const user = usersMap[userId];
  const userFullName = `${user?.firstname} ${user?.lastname}`;

  const assignedBy = usersMap[assignedById];
  const assignedByFullName = `${assignedBy?.firstname} ${assignedBy?.lastname}`;

  let message = '';
  if (user) {
    message = `<span style="font-weight: 600;">${assignedByFullName}</span> assigned the ticket to <span style="font-weight: 600;">${userFullName}</span>`;
  } else {
    message = `<span style="font-weight: 600;">${assignedByFullName}</span> unassigned the ticket.`;
  }

  return message;
}

export const getPriorityChangeTitle = async (): Promise<string> => {
  return `Priority Changed`;
}

export const getPriorityChangeRemarkMessage = async (priority: TicketsPriorities, assignedById: string): Promise<string> => {
  const priorityName = transformText(priority);
  const usersMapData = get(allUsersMap);
  const assignedBy = usersMapData[assignedById];
  const assignedByFullName = `${assignedBy?.firstname} ${assignedBy?.lastname}`;
  const message = `<span style="font-weight: 600;">${assignedByFullName}</span> changed the priority to <span style="font-weight: 600;">${priorityName}</span>`;
  return message;
}

export const getStatusChangeTitle = async (): Promise<string> => {
  return `Status Changed`;
}

export const getStatusChangeRemarkMessage = async (status: TicketStatuses, assignedById: string): Promise<string> => {
  const statusName = transformText(status);
  const usersMapData = get(allUsersMap);
  const assignedBy = usersMapData[assignedById];
  const assignedByFullName = `${assignedBy?.firstname} ${assignedBy?.lastname}`;
  const message = `<span style="font-weight: 600;">${assignedByFullName}</span> changed the status to <span style="font-weight: 600;">${statusName}</span>`;
  return message;
}