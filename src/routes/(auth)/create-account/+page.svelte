<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import PrimaryInformationForm, { type FormData as PrimaryInformationFormData, defaultFormData as defaultPrimaryInformationFormData } from "./PrimaryInformationForm.svelte";
	import CreateAccountForm, { type FormData as CreateAccountFormData, defaultFormData as defaultCreateAccountFormData } from "./CreateAccountForm.svelte";
	import { CREATE_ACCOUNT_SUCCESS, LOGIN } from "$lib/constants";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { goto } from "$app/navigation";
	import { departmentsActions } from "$lib/store/departments.store";
	import { onMount } from "svelte";
	import type { PostUsers } from "$lib/models/users/users.type";
	import { PostUsersSchema, UserRolesEnumSchema } from "$lib/models/users/users.schema";
	import { BaseStatusEnumSchema } from "$lib/models/common/common.schema";
	import { usersActions } from "$lib/store/users.store";
	import { uuid } from "$lib/utils/uuid.util";

	const primaryInformationValue = 'primary-information';
	const createAccountValue = 'create-account';

  let activeTab = $state(primaryInformationValue);
  let isPrimaryInformationFormInvalid = $state(false);
  let disabledCreateAccountTab = $state(true);

  let primaryInformationFormData = $state<PrimaryInformationFormData>(defaultPrimaryInformationFormData);
  let createAccountFormData = $state<CreateAccountFormData>(defaultCreateAccountFormData);

  onMount(() => {
    departmentsActions.getDepartments({ page: 1, size: 25 });
  });

  function handlePrimaryInformationFormProceed(__: PrimaryInformationFormData) {
    disabledCreateAccountTab = false;

    if (!isPrimaryInformationFormInvalid) {
      activeTab = createAccountValue;
    }
  }

  async function handleCreateAccount(__: CreateAccountFormData) {
    const payload: PostUsers = PostUsersSchema.parse({
      id: uuid(),
      ...primaryInformationFormData,
      ...createAccountFormData,
      role: UserRolesEnumSchema.enum.user,
      status: BaseStatusEnumSchema.enum.active,
      avatar: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    await usersActions.createUser(payload, true);
    goto(CREATE_ACCOUNT_SUCCESS);
  }
</script>

<div class="flex w-full justify-start mb-5">
  <Button variant="ghost" onclick={() => goto(LOGIN)}>
    <ArrowLeftIcon class="w-4 h-4" />
    Back to Login
  </Button>
</div>
<div class="mb-10 flex flex-col gap-2 text-center">
  <h1 class="text-2xl font-bold">Create your account</h1>
  <p class="text-md text-gray-500">Enter the following information to create your account</p>
</div>
<div class="w-full max-w-lg">
  <Tabs bind:value={activeTab}>
    <TabsList>
      <TabsTrigger value={primaryInformationValue}>Primary Information</TabsTrigger>
      <TabsTrigger value={createAccountValue} disabled={isPrimaryInformationFormInvalid || disabledCreateAccountTab}>Create Account</TabsTrigger>
    </TabsList>
    <TabsContent value={primaryInformationValue}>
      <PrimaryInformationForm bind:invalid={isPrimaryInformationFormInvalid} bind:formData={primaryInformationFormData} onProceed={handlePrimaryInformationFormProceed} />
    </TabsContent>
    <TabsContent value={createAccountValue}>
      <CreateAccountForm bind:formData={createAccountFormData} onCreateAccount={handleCreateAccount} />
    </TabsContent>
  </Tabs>
</div>