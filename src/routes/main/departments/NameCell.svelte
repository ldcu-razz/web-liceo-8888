<script lang="ts">
  type Props = {
    name: string;
    id: string;
    onView?: (id: string) => void;
  };

  let { name, id, onView }: Props = $props();
</script>

<button
  type="button"
  class="text-left hover:underline underline-offset-4 cursor-pointer font-medium"
  onclick={() => onView?.(id)}
>
  {name}
</button>

