<script lang="ts">
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";
	import UserAvatar from "./UserAvatar.svelte";

  type Props = {
    name: string;
    id: string;
    avatar?: string;
    showAvatar?: boolean;
    onView?: (id: string) => void;
  };

  let { name, id, avatar, showAvatar = false, onView }: Props = $props();

  let imageLink = $derived(avatar ?? DEFAULT_AVATAR);
</script>

<div class="flex items-center gap-2">
  {#if showAvatar}
    <UserAvatar name={name} imageLink={imageLink} sizeClass="size-6" />
  {/if}
  <button
    type="button"
    class="text-left hover:underline underline-offset-4 cursor-pointer font-medium"
    onclick={() => onView?.(id)}
  >
    {name}
  </button>
</div>

