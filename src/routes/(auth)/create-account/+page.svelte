<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import PrimaryInformationForm, {
		type FormData as PrimaryInformationFormData,
		defaultFormData as defaultPrimaryInformationFormData
	} from './PrimaryInformationForm.svelte';
	import CreateAccountForm, {
		type FormData as CreateAccountFormData,
		defaultFormData as defaultCreateAccountFormData
	} from './CreateAccountForm.svelte';
	import { CREATE_ACCOUNT_SUCCESS, LOGIN } from '$lib/constants';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeftIcon } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { departmentsActions } from '$lib/store/departments.store';
	import { onMount } from 'svelte';
	import type { PostUsers } from '$lib/models/users/users.type';
	import {
		PostUsersSchema,
		UserRolesEnumSchema,
		UserStatusEnumSchema
	} from '$lib/models/users/users.schema';
	import { usersActions } from '$lib/store/users.store';
	import { uuid } from '$lib/utils/uuid.util';
	import { systemSettingsActions, systemSettingsStore } from '$lib/store/system-settings.store';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import CreateUserReachLimit from './CreateUserReachLimit.svelte';

	const primaryInformationValue = 'primary-information';
	const createAccountValue = 'create-account';

	let activeTab = $state(primaryInformationValue);
	let isPrimaryInformationFormInvalid = $state(false);
	let disabledCreateAccountTab = $state(true);
	let totalUsers = $state(0);
	let loading = $state(false);

	let systemSettings = $derived($systemSettingsStore);

	let primaryInformationFormData = $state<PrimaryInformationFormData>(
		defaultPrimaryInformationFormData
	);
	let createAccountFormData = $state<CreateAccountFormData>(defaultCreateAccountFormData);

	let isAccountCreationLimitReached = $derived(totalUsers >= (systemSettings?.number_of_users_creation_limit || 0));

	onMount(async () => {
		loading = true;
		const { count } = await usersActions.getTotalUsers();
		totalUsers = count;
		loading = false;
		departmentsActions.getDepartments({ page: 1, size: 25 });
	});

	function handlePrimaryInformationFormProceed(__: PrimaryInformationFormData) {
		disabledCreateAccountTab = false;

		if (!isPrimaryInformationFormInvalid) {
			activeTab = createAccountValue;
		}
	}

	async function handleCreateAccount(__: CreateAccountFormData) {
		try {
			const payload: PostUsers = PostUsersSchema.parse({
				id: uuid(),
				...primaryInformationFormData,
				...createAccountFormData,
				role: UserRolesEnumSchema.enum.user,
				status: UserStatusEnumSchema.enum.needs_verification,
				avatar: '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			});

			await usersActions.createAccount(payload);
			goto(CREATE_ACCOUNT_SUCCESS);
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="mb-5 flex w-full justify-start">
	<Button variant="ghost" onclick={() => goto(LOGIN)}>
		<ArrowLeftIcon class="h-4 w-4" />
		Back to Login
	</Button>
</div>
{#if loading}
<div class="flex flex-col items-center justify-center gap-2 w-full max-w-lg mx-auto">
	<Skeleton class="w-full h-24" />
	<Skeleton class="w-full h-24" />
	<Skeleton class="w-full h-24" />
	<Skeleton class="w-full h-24" />
</div>
{:else}
	{#if isAccountCreationLimitReached}
		<CreateUserReachLimit />
	{:else}
		<div class="mb-10 flex flex-col gap-2 text-center">
			<h1 class="text-2xl font-bold">Create your account</h1>
			<p class="text-md text-gray-500">Enter the following information to create your account</p>
		</div>
		<div class="w-full max-w-lg">
			<Tabs bind:value={activeTab}>
				<TabsList>
					<TabsTrigger value={primaryInformationValue}>Primary Information</TabsTrigger>
					<TabsTrigger
						value={createAccountValue}
						disabled={isPrimaryInformationFormInvalid || disabledCreateAccountTab}
						>Create Account</TabsTrigger
					>
				</TabsList>
				<TabsContent value={primaryInformationValue}>
					<PrimaryInformationForm
						bind:invalid={isPrimaryInformationFormInvalid}
						bind:formData={primaryInformationFormData}
						onProceed={handlePrimaryInformationFormProceed}
					/>
				</TabsContent>
				<TabsContent value={createAccountValue}>
					<CreateAccountForm
						bind:formData={createAccountFormData}
						onCreateAccount={handleCreateAccount}
					/>
				</TabsContent>
			</Tabs>
		</div>
	{/if}
{/if}
