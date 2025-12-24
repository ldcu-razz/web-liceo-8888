<script lang="ts" module>
  import type { Snippet } from "svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
	import { Textarea } from "../ui/textarea";
	import { DEFAULT_AVATAR } from "$lib/constants/avatar.constants";

  export type Props = {
    value?: string;
  }
</script>

<script lang="ts">
  let { value = $bindable() }: Props = $props();

  let avatar = $derived(DEFAULT_AVATAR);

  let userFullName = $derived('John Doe');
</script>

<div class="flex gap-2">
  <Avatar class="size-8 border border-gray-200">
    <AvatarImage src={avatar} />
    <AvatarFallback class="text-sm">{userFullName.slice(0, 2).toUpperCase()}</AvatarFallback>
  </Avatar>
  <Textarea value={value} placeholder="Add a comment" class="flex-1" rows={6} />
</div>