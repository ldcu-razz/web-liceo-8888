<script lang="ts">
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$lib/components/ui/collapsible';
  import { SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '$lib/components/ui/sidebar';
  import { ChevronRight } from '@lucide/svelte';
  import { page } from '$app/stores';
  import type { SidebarModel } from '$lib/models/sidebar/sidebar.model';

  let { item }: { item: SidebarModel[number] } = $props();
  
  // Validate that children exists
  $effect.pre(() => {
    if (!item.children) {
      throw new Error('CollapsibleMenuItem requires item with children');
    }
  });
  
  const children = $derived(item.children!);
  const isAnyChildActive = $derived(children.some(child => child.href && $page.url.pathname.includes(child.href)));
  let open = $state(false);
  
  // Initialize and sync open state with active child
  $effect(() => {
    if (isAnyChildActive) {
      open = true;
    }
  });
</script>

<Collapsible bind:open class="group/collapsible">
  <CollapsibleTrigger class="w-full">
    <SidebarMenuButton isActive={isAnyChildActive}>
      <item.icon />
      <span class="flex-1 text-left">{item.label}</span>
      <ChevronRight 
        class="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ml-auto" 
      />
    </SidebarMenuButton>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <SidebarMenuSub class="pe-0 mr-0">
      {#each children as child (child.label)}
        <SidebarMenuSubItem>
          <SidebarMenuSubButton 
            isActive={child.href ? $page.url.pathname.includes(child.href) : false}
            href={child.href}
          >
            {child.label}
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      {/each}
    </SidebarMenuSub>
  </CollapsibleContent>
</Collapsible>

