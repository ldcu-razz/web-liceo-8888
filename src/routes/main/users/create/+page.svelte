<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftIcon, User } from '@lucide/svelte';
	import UserForm, { type FormData } from './UserForm.svelte';
	import { usersActions } from '$lib/store/users.store';
	import type { PostUsers } from '$lib/models/users/users.type';
	import { uuid } from '$lib/utils/uuid.util';
	import { PostUsersSchema, UserRolesEnumSchema } from '$lib/models/users/users.schema';
	import { USERS } from '$lib/constants';
	import { BaseStatusEnumSchema } from '$lib/models/common/common.schema';
	import { systemSettingsStore } from '$lib/store/system-settings.store';

	let loading = $state(false);

	let systemSettings = $derived($systemSettingsStore);

	let numberOfTicketsCreationLimit = $derived(systemSettings?.number_of_tickets_creation_limit ?? 0);

	function goBack() {
		goto(USERS);
	}

	async function handleCreateUser(formData: FormData) {
		loading = true;

		try {
			const data = {
				...formData,
				id: uuid(),
				avatar: '',
				status: BaseStatusEnumSchema.enum.active,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};
			const payload: PostUsers = PostUsersSchema.parse(data);

			await usersActions.createUser(payload);
			
			const isRoleUser = payload.role === UserRolesEnumSchema.enum.user;
			if (isRoleUser) {
				await usersActions.createUserProperties(payload.id, {
					id: uuid(),
					user_id: payload.id,
					remaining_tickets_creation: numberOfTicketsCreationLimit,
					bypass_ticket_creation_limit: false
				}, true);
			}
			goto(USERS);
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-2 flex max-w-4xl flex-col gap-4">
	<div class="mb-5 flex w-full justify-start">
		<Button variant="ghost" onclick={goBack}>
			<ArrowLeftIcon class="h-4 w-4" />
			Back to Users
		</Button>
	</div>
	<div class="flex items-center justify-between">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 p-2">
			<User class="size-6 text-blue-500" />
		</div>
	</div>
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold">Create New User</h1>
		<p class="text-sm text-gray-500">Create a new user by filling out the form below.</p>
	</div>

	<div class="mt-2">
		<UserForm {loading} onCancel={goBack} onCreateUser={handleCreateUser} />
	</div>
</div>
