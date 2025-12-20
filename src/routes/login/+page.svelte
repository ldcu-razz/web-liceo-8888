<script lang="ts">
	import MainAvatar from '$lib/components/common/MainAvatar.svelte';
	import LoginForm from './LoginForm.svelte';
	import buildingImage from '$lib/assets/images/building-image.png';
	import liceoLogo from '$lib/assets/images/liceo-logo.png';
</script>

<div class="grid min-h-screen grid-cols-10">
	<div class="relative col-span-4 hidden h-full justify-center bg-primary text-white md:flex">
		<div class="absolute top-8 left-8">
			<img src={liceoLogo} alt="Logo" class="h-[60px] w-[320px]" />
		</div>
		<div class="mt-48 flex flex-col gap-2 text-white">
			<h3 class="text-2xl font-bold">Welcome</h3>
			<h1 class="text-6xl font-bold">LICEO 8888</h1>
		</div>
		<div class="absolute bottom-0 left-0">
			<img src={buildingImage} alt="Building" class="h-full w-full object-contain" />
		</div>
	</div>
	<div
		class="relative col-span-10 flex h-full flex-col items-center justify-center p-6 md:col-span-6"
	>
		<div class="absolute top-8 left-8">
			<MainAvatar />
		</div>
		<div class="mb-10 flex flex-col gap-2 text-center">
			<h1 class="text-2xl font-bold">Login to your account</h1>
			<p class="text-md text-gray-500">Enter your username and password to login</p>
		</div>
		<div class="w-full max-w-sm">
			<LoginForm />
		</div>
	</div>
</div>
