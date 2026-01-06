<script lang="ts" module>
	import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import type { GetTicketComment } from "$lib/models/tickets/ticket-comments.type";
	import { allUsersMap } from "$lib/store/users.store";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Trash, SquarePenIcon, EllipsisIcon } from "@lucide/svelte";
	import ReadableDate from "$lib/components/common/ReadableDate.svelte";
	import RichTextEditor from "$lib/components/common/RichTextEditor.svelte";
	import { Button } from "$lib/components/ui/button";
	import type { MentionedUsers } from "$lib/models/users/users.type";
	import { onMount } from "svelte";

  export type Props = {
    comment: GetTicketComment;
    onEdit?: () => void;
    onSaveEdit?: (value: string, mentionedUsers: MentionedUsers[]) => void;
    onDelete?: () => void;
  }
</script>

<script lang="ts">
  let { comment, onEdit, onSaveEdit, onDelete }: Props = $props();

  let usersMap = $derived($allUsersMap);

  let createdByUser = $derived(usersMap[comment.created_by.id]);

  let createdByUserInitial = $derived(createdByUser ? createdByUser?.firstname.slice(0, 1).toUpperCase() + createdByUser?.lastname.slice(0, 1).toUpperCase() : 'AU');

  let isEdit = $state(false);

  let commentValue = $state("");

  let mentionedUsers = $state<MentionedUsers[]>([]);

  onMount(() => {
    commentValue = comment.comment;
    mentionedUsers = comment.mentioned_users;
  });

  function handleEdit() {
    onEdit?.();
    isEdit = true;
    commentValue = comment.comment;
  }

  function handleDelete() {
    onDelete?.();
  }

  function handleCancelEdit() {
    isEdit = false;
    commentValue = "";
  }

  function handleSaveEdit() {
    onSaveEdit?.(commentValue, mentionedUsers);
    isEdit = false;
    commentValue = "";
  }
</script>

<div class="flex flex-col gap-1 py-3">
  <div class="flex items-start justify-between gap-2">
    <div class="flex items-center gap-3">
      <Avatar class="size-8 border border-gray-200">
        <AvatarImage src={createdByUser?.avatar ?? DEFAULT_AVATAR} />
        <AvatarFallback class="text-sm font-semibold">{createdByUserInitial}</AvatarFallback>
      </Avatar>
      <div class="flex items-center gap-2">
        <p class="text-xs font-semibold text-gray-900">{createdByUser?.firstname} {createdByUser?.lastname}</p>
        <p class="text-[10px] text-gray-500"><ReadableDate date={comment.createdAt} /></p>
      </div>
    </div>
    
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex items-center justify-center size-5 rounded-sm hover:bg-gray-100 transition-colors">
        <EllipsisIcon class="size-4 text-gray-600" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="w-40">
        <DropdownMenu.Item class="cursor-pointer" onclick={handleEdit}>
          <SquarePenIcon class="size-4" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item class="cursor-pointer" onclick={handleDelete}>
          <Trash class="size-4 text-red-600" />
          <span class="text-red-600">Delete</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  
  {#if isEdit}
    <div class="flex flex-col gap-2 mt-2">
      <div class="pl-11">
        <RichTextEditor bind:value={commentValue} bind:mentionedUsers placeholder="Edit comment" hideAvatar={true} />
      </div>
      <div class="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onclick={handleCancelEdit}>Cancel</Button>
        <Button variant="outline" size="sm" onclick={handleSaveEdit}>Save</Button>
      </div>
    </div>
  {:else}
    <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-line ml-11">{@html comment.comment}</p>
  {/if}
</div>