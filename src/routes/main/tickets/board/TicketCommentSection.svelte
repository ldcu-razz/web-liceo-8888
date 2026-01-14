<script lang="ts" module>
	import RichTextEditor from '$lib/components/common/RichTextEditor.svelte';
	import type {
		PostTicketComment,
		DeleteTicketComment,
		PutTicketComment
	} from '$lib/models/tickets/ticket-comments.type';
	import type { MentionedUsers } from '$lib/models/users/users.type';
	import { meStore } from '$lib/store/me.store';
	import {
		ticketCommentsActions,
		ticketCommentsLoadingStore,
		ticketCommentsStore
	} from '$lib/store/ticket-comments.store';
	import { uuid } from '$lib/utils/uuid.util';
	import { onMount } from 'svelte';
	import TicketCommentItem from './TicketCommentItem.svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { UserRolesEnumSchema } from '$lib/models/users/users.schema';
	import type { GetTicket } from '$lib/models/tickets/tickets.type';

	export type Props = {
		ticket: GetTicket;
		anon?: boolean;
	};
</script>

<script lang="ts">
	let { ticket }: Props = $props();
	
	let ticketId = $derived(ticket.id);
	let anon = $derived(ticket.anon);

	let commentValue = $state('');
	let visibleToReporter = $state(false);
	let mentionedUsers = $state<MentionedUsers[]>([]);
	let editingCommentId = $state<string | null>(null);
	let deleteCommentId = $state<string | null>(null);

	let me = $derived($meStore);

	let isMeUserRole = $derived(me?.role === UserRolesEnumSchema.enum.user);

	let ticketComments = $derived($ticketCommentsStore);

	let ticketCommentsLoading = $derived($ticketCommentsLoadingStore);

	let showVisibleToReporterCheckbox = $derived(!isMeUserRole);

	let reportedBy = $derived(ticket.reported_by);

	onMount(() => {
		if (isMeUserRole) {
			ticketCommentsActions.getTicketComments(ticketId, true);
		} else {
			ticketCommentsActions.getTicketComments(ticketId);
		}
	});

	function handleSubmitComment(value: string, mentions: MentionedUsers[] = []) {
		const is_visible_to_public = isMeUserRole ? true : visibleToReporter;
		const body: PostTicketComment = {
			id: uuid(),
			ticket_id: ticketId,
			comment: value,
			mentioned_users: mentions,
			is_visible_to_public,
			created_by: me?.id || '',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		ticketCommentsActions.postTicketComment(ticketId, body);
	}

	function handleEditComment(commentId: string) {
		editingCommentId = commentId;
		// TODO: Implement edit functionality
		console.log('Edit comment:', commentId);
	}

	function handleDeleteComment(commentId: string) {
		deleteCommentId = commentId;
	}

	function confirmDelete() {
		if (deleteCommentId) {
			const body: DeleteTicketComment = {
				id: deleteCommentId
			};
			ticketCommentsActions.deleteTicketComment(ticketId, body);
			deleteCommentId = null;
		}
	}

	function handleSaveEdit(commentId: string, mentionedUsers: MentionedUsers[], value: string) {
		const body: PutTicketComment = {
			id: commentId,
			comment: value,
			mentioned_users: mentionedUsers,
			updatedAt: new Date().toISOString()
		};
		ticketCommentsActions.putTicketComment(ticketId, body);
	}
</script>

<div class="flex h-full flex-col gap-2">
	{#if ticketCommentsLoading}
		<div class="mt-auto flex flex-col justify-center gap-3">
			<Skeleton class="h-16 w-full rounded-md" />
			<Skeleton class="h-16 w-full rounded-md" />
			<Skeleton class="h-16 w-full rounded-md" />
		</div>
	{:else}
		<div class="mt-auto">
			<RichTextEditor
				bind:value={commentValue}
				bind:visibleToReporter
				bind:mentionedUsers
				{showVisibleToReporterCheckbox}
				showSubmitButton={true}
				placeholder="Write a comment"
				onSubmit={handleSubmitComment}
			/>
		</div>
		{#each ticketComments as comment (comment.id)}
			{@const displayAsAnon = anon && reportedBy?.id === comment.created_by.id}
			<TicketCommentItem
				{comment}
				displayAsAnon={displayAsAnon}
				onEdit={() => handleEditComment(comment.id)}
				onDelete={() => handleDeleteComment(comment.id)}
				onSaveEdit={(value: string, mentionedUsers: MentionedUsers[]) =>
					handleSaveEdit(comment.id, mentionedUsers, value)}
			/>
		{/each}
	{/if}
</div>

<AlertDialog.Root open={deleteCommentId !== null} onOpenChange={() => (deleteCommentId = null)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete Comment</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to delete this comment? This action cannot be undone.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmDelete} class="bg-red-600 hover:bg-red-700"
				>Delete</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
