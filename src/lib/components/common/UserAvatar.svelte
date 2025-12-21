<script lang="ts" module>
  export type Props = {
    name: string;
    imageLink?: string;
    sizeClass?: string;
  };
</script>

<script lang="ts">
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";

  let { name, imageLink = "https://github.com/evilrabbit.png", sizeClass = "size-8" }: Props = $props();
</script>

<Avatar class={sizeClass}>
  <AvatarImage src={imageLink} />
  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
</Avatar>