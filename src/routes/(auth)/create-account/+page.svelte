<script lang="ts" module>
	const emailAddressValue = 'email-address';
	const primaryInformationValue = 'primary-information';
	const departmentSelectionValue = 'department-selection';
	const userAccountValue = 'user-account';

	type NavigationStep = typeof emailAddressValue | typeof primaryInformationValue | typeof departmentSelectionValue | typeof userAccountValue;
</script>

<script lang="ts">
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
	import { systemSettingsStore } from '$lib/store/system-settings.store';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import CreateUserReachLimit from './CreateUserReachLimit.svelte';
	import EmailForm, { type FormData as EmailFormData, initialFormData as initialEmailFormData } from './EmailForm.svelte';
	import UserPrimaryInformationForm, { type FormData as UserPrimaryInformationFormData, initialFormData as initialUserPrimaryInformationFormData } from './UserPrimaryInformationForm.svelte';
	import DepartmentForm, { type FormData as DepartmentFormData, initialFormData as initialDepartmentFormData } from './DepartmentForm.svelte';
	import UserAccountForm, { type FormData as UserAccountFormData, initialFormData as initialUserAccountFormData } from './UserAccountForm.svelte';

	let activeStep = $state<NavigationStep>(emailAddressValue);
	let totalUsers = $state(0);
	let loading = $state(true);

	let emailAddressFormData = $state<EmailFormData>(initialEmailFormData);
	let userPrimaryInformationFormData = $state<UserPrimaryInformationFormData>(initialUserPrimaryInformationFormData);
	let departmentFormData = $state<DepartmentFormData>(initialDepartmentFormData);
	let userAccountFormData = $state<UserAccountFormData>(initialUserAccountFormData);
	let isCreatingAccount = $state(false);

	let systemSettings = $derived($systemSettingsStore)

	let isAccountCreationLimitReached = $derived(
		totalUsers >= (systemSettings?.number_of_users_creation_limit || 0)
	);

	onMount(async () => {
		loading = true;
		const { count } = await usersActions.getTotalUsers();
		totalUsers = count;
		loading = false;

		departmentsActions.getDepartments({ page: 1, size: 25 });
	});

	async function handleCreateAccount() {
		try {
			isCreatingAccount = true;
			const { username, password } = userAccountFormData;
			const payload: PostUsers = PostUsersSchema.parse({
				id: uuid(),
				...emailAddressFormData,
				...userPrimaryInformationFormData,
				...departmentFormData,
				username,
				password,
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
		} finally {
			isCreatingAccount = false;
		}
	}

	function handleEmailAddressFormProceed(__: EmailFormData) {
		activeStep = primaryInformationValue;
	}

	function handleUserPrimaryInformationFormProceed(__: UserPrimaryInformationFormData) {
		activeStep = departmentSelectionValue;
	}

	function handleDepartmentFormProceed(__: DepartmentFormData) {
		activeStep = userAccountValue;
	}

	function handleUserAccountFormProceed(__: UserAccountFormData) {
		handleCreateAccount();
	}
</script>

<div class="mb-5 flex w-full justify-start">
	<Button variant="ghost" onclick={() => goto(LOGIN)}>
		<ArrowLeftIcon class="h-4 w-4" />
		Back to Login
	</Button>
</div>
{#if loading}
	<div class="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-2">
		<Skeleton class="h-24 w-full" />
		<Skeleton class="h-24 w-full" />
		<Skeleton class="h-24 w-full" />
		<Skeleton class="h-24 w-full" />
	</div>
{:else if isAccountCreationLimitReached}
	<CreateUserReachLimit />
{:else}
	<div class="mb-10 flex flex-col gap-2 text-center">
		<h1 class="text-2xl font-bold">Create your account</h1>
		<p class="text-md text-gray-500">Enter the following information to create your account</p>
	</div>
	<div class="w-full max-w-lg p-6 bg-gray-50 rounded-md">
		{#if activeStep === emailAddressValue}
			<EmailForm
				bind:formData={emailAddressFormData}
				onSubmit={handleEmailAddressFormProceed}
			/>
		{:else if activeStep === primaryInformationValue}
			<UserPrimaryInformationForm
				bind:formData={userPrimaryInformationFormData}
				onCancel={() => activeStep = emailAddressValue}
				onSubmit={handleUserPrimaryInformationFormProceed}
			/>
		{:else if activeStep === departmentSelectionValue}
			<DepartmentForm
				bind:formData={departmentFormData}
				onCancel={() => activeStep = primaryInformationValue}
				onSubmit={handleDepartmentFormProceed}
			/>
		{:else if activeStep === userAccountValue}
			<UserAccountForm
				bind:formData={userAccountFormData}
				disabled={isCreatingAccount}
				onCancel={() => activeStep = departmentSelectionValue}
				onSubmit={handleUserAccountFormProceed}
			/>
		{/if}
	</div>
{/if}
