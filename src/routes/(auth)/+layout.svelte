<script lang="ts">
	import liceoLogo from '$lib/assets/images/liceo-logo.png';
	import buildingImage from '$lib/assets/images/building-image.png';

	let { children } = $props();
</script>

<div class="grid min-h-screen grid-cols-10">
	<div
		class="relative col-span-10 flex h-full w-full justify-center bg-primary text-white md:col-span-4"
	>
		<div class="absolute top-8 left-8">
			<img src={liceoLogo} alt="Logo" class="h-[60px] w-[320px]" />
		</div>
		<div class="mt-50 mb-10 flex flex-col items-center gap-2 px-2 text-center text-white">
			<h3 class="font-serif text-3xl text-amber-400/90 md:text-3xl">Welcome to</h3>
			<h1 class="font-serif text-6xl font-bold text-amber-400/90 md:text-8xl">LICEO 8888</h1>
		</div>
		<div class="absolute bottom-0 left-0">
			<img src={buildingImage} alt="Building" class="h-full w-full object-contain" />
		</div>
	</div>
	<div class="relative col-span-10 flex h-full flex-col items-center p-6 pt-14 md:col-span-6">
		{@render children?.()}
	</div>
</div>
