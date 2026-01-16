import type {
	DeleteTicketComment,
	PostTicketComment,
	PutTicketComment,
	GetTicketComment
} from '$lib/models/tickets/ticket-comments.type';
import type { Pagination } from '$lib/models/common/common.type';
import { get, writable } from 'svelte/store';
import {
	deleteTicketComment,
	getTicketComments,
	postTicketComment,
	putTicketComment
} from '$lib/services/tickets/ticket-comment.service';
import { toast } from 'svelte-sonner';
import { notificationsActions } from './notifications.store';
import { ticketsStore } from './tickets.store';

export const ticketCommentsStore = writable<GetTicketComment[]>([]);
export const ticketCommentsPaginationStore = writable<Pagination>({ page: 1, size: 10 });
export const ticketCommentsTotalCountStore = writable<number>(0);
export const ticketCommentsLoadingStore = writable<boolean>(false);
export const ticketCommentsErrorStore = writable<string | null>(null);

export const ticketCommentsActions = {
	getTicketComments: async (ticket_id: string, isVisibleToPublic?: boolean) => {
		ticketCommentsLoadingStore.set(true);
		try {
			const comments = await getTicketComments(ticket_id, isVisibleToPublic);
			ticketCommentsStore.set(comments.data);
			ticketCommentsPaginationStore.set({ page: comments.page, size: comments.size });
			ticketCommentsTotalCountStore.set(comments.count);
		} catch (error) {
			console.error(error);
			ticketCommentsErrorStore.set((error as Error).message);
		} finally {
			ticketCommentsLoadingStore.set(false);
		}
	},

	postTicketComment: async (ticket_id: string, body: PostTicketComment) => {
		const toastId = toast.loading(`Posting comment...`);
		try {
			const comment = await postTicketComment(ticket_id, body);
			ticketCommentsStore.update((prev) => [comment, ...prev]);
			toast.success(`Comment posted successfully`, { id: toastId });

			const ticket = get(ticketsStore).find((t) => t.id === ticket_id);
			if (ticket) {
				notificationsActions.createTicketCommentedNotification(ticket, comment);
			}
		} catch (error) {
			console.error(error);
			ticketCommentsErrorStore.set((error as Error).message);
			ticketCommentsStore.update((prev) => prev.filter((c) => c.id !== body.id));
			toast.error(`Failed to post comment`, { id: toastId });
		}
	},

	putTicketComment: async (ticket_id: string, body: PutTicketComment) => {
		const toastId = toast.loading(`Updating comment...`);
		try {
			ticketCommentsStore.update((prev) =>
				prev.map((c) => (c.id === body.id ? { ...c, ...body, created_by: c.created_by } : c))
			);
			await putTicketComment(ticket_id, body);
			toast.success(`Comment updated successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			ticketCommentsErrorStore.set((error as Error).message);
			toast.error(`Failed to update comment`, { id: toastId });
		}
	},

	deleteTicketComment: async (ticket_id: string, body: DeleteTicketComment) => {
		const toastId = toast.loading(`Deleting comment...`);
		const currentComment = get(ticketCommentsStore).find((c: GetTicketComment) => c.id === body.id);
		try {
			ticketCommentsStore.update((prev) => prev.filter((c) => c.id !== body.id));
			await deleteTicketComment(ticket_id, body);
			toast.success(`Comment deleted successfully`, { id: toastId });
		} catch (error) {
			console.error(error);
			ticketCommentsErrorStore.set((error as Error).message);
			ticketCommentsStore.update((prev) => (currentComment ? [currentComment, ...prev] : prev));
			toast.error(`Failed to delete comment`, { id: toastId });
		}
	},

	reset: async () => {
		ticketCommentsStore.set([]);
		ticketCommentsPaginationStore.set({ page: 1, size: 10 });
		ticketCommentsTotalCountStore.set(0);
		ticketCommentsLoadingStore.set(false);
		ticketCommentsErrorStore.set(null);
	}
};
