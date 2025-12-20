<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import PrimaryInformationForm, { type FormData as PrimaryInformationFormData } from "./PrimaryInformationForm.svelte";
	import CreateAccountForm, { type FormData as CreateAccountFormData } from "./CreateAccountForm.svelte";
	import { CREATE_ACCOUNT_SUCCESS, LOGIN } from "$lib/constants";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { goto } from "$app/navigation";

	const primaryInformationValue = 'primary-information';
	const createAccountValue = 'create-account';

  let activeTab = $state(primaryInformationValue);
  let isPrimaryInformationFormInvalid = $state(false);
  let disabledCreateAccountTab = $state(true);

  function handlePrimaryInformationFormProceed(__: PrimaryInformationFormData) {
    disabledCreateAccountTab = false;

    if (!isPrimaryInformationFormInvalid) {
      activeTab = createAccountValue;
    }
  }

  function handleCreateAccount(__: CreateAccountFormData) {
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
      <PrimaryInformationForm bind:invalid={isPrimaryInformationFormInvalid} onProceed={handlePrimaryInformationFormProceed} />
    </TabsContent>
    <TabsContent value={createAccountValue}>
      <CreateAccountForm onCreateAccount={handleCreateAccount} />
    </TabsContent>
  </Tabs>
</div>