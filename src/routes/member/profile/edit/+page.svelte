<script lang="ts">
	import { goto } from '$app/navigation';
	import { MEMBER_PROFILE } from '$lib/constants';
	import { onMount } from 'svelte';
	import AppBar from '../../AppBar.svelte';
	import EditProfilePrimaryInfoForm, {
		initialFormData as initialPrimaryInfoFormData,
		type FormData
	} from './EditProfilePrimaryInfoForm.svelte';
	import { meActions, meStore } from '$lib/store/me.store';
	import { SexEnumSchema } from '$lib/models/common/common.schema';

	let me = $derived($meStore);

	let formData = $state(initialPrimaryInfoFormData);

	onMount(() => {
		formData = {
			firstname: me?.firstname ?? '',
			lastname: me?.lastname ?? '',
			sex: me?.sex ?? SexEnumSchema.enum.male,
			birthdate: me?.birthdate ?? '',
			email: me?.email ?? '',
			contact_number: me?.contact_number ?? ''
		};
	});

	function handleBackButtonClick() {
		goto(MEMBER_PROFILE);
	}

	async function handleSubmit(formData: FormData) {
		await meActions.updateMe(formData);
		goto(MEMBER_PROFILE);
	}
</script>

<section>
	<AppBar title="Edit Profile" backButtonOnClick={handleBackButtonClick} />

	<div class="mx-4 mt-24">
		<EditProfilePrimaryInfoForm
			bind:formData
			onBack={handleBackButtonClick}
			onSubmit={handleSubmit}
		/>
	</div>
</section>
