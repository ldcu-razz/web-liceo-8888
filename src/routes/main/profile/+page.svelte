<script lang="ts">
	import { AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
	import Avatar from "$lib/components/ui/avatar/avatar.svelte";
	import { Button } from "$lib/components/ui/button";
	import { meStore } from "$lib/store/me.store";

  let me = $derived($meStore);
</script>

<div class="flex flex-col gap-6 py-4">
  <div class="flex items-center gap-5">
    <Avatar class="size-28 border-3">
      <AvatarImage src={me?.avatar ?? ''} />
      <AvatarFallback>
        <div class="text-4xl font-bold">
          JD
        </div>
      </AvatarFallback>
    </Avatar>

    <div class="flex gap-2">
      <Button variant="outline" size="sm" class="text-xs p-2">Upload Picture</Button>
      <Button variant="outline" size="sm" class="text-xs p-2">Delete Picture</Button>
    </div>
  </div>

  <div class="flex flex-col gap-2 border border-dashed border-gray-300 rounded-xl p-6">
    <div class="flex justify-between">
      <h2 class="text-md font-semibold">Profile Information</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-2">
      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">RFID</span>
        <span class="text-sm">{me?.rfid_number ?? ''}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Firstname</span>
        <span class="text-sm">{me?.firstname ?? ''}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Lastname</span>
        <span class="text-sm">{me?.lastname ?? ''}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Sex</span>
        <span class="text-sm">{me?.sex ?? ''}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Birthdate</span>
        <span class="text-sm">{new Date(me?.birthdate ?? '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Contact</span>
        <span class="text-sm">{me?.contact_number ?? ''}</span>
      </div>

      <div class="flex flex-col gap-1 col-span-4">
        <span class="text-xs text-gray-500">Email</span>
        <span class="text-sm">{me?.email ?? ''}</span>
      </div>
    </div>
  </div>
</div>