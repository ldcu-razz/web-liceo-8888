<script lang="ts">
	import liceoLogo from '$lib/assets/images/liceo-logo.png';
	import buildingImage from '$lib/assets/images/building-image.png';

	let { children } = $props();
</script>

<div class="grid min-h-screen grid-cols-10">
	<div class="relative col-span-10 md:col-span-4 h-full w-full justify-center bg-primary text-white flex">
		<div class="absolute top-8 left-8">
			<img src={liceoLogo} alt="Logo" class="h-[60px] w-[320px]" />
		</div>
		<div class="mt-50 flex flex-col items-center text-center gap-2 text-white px-2 mb-10">
			<h3 class="text-3xl md:text-3xl font-serif text-amber-400/90">Welcome to</h3>
			<h1 class="text-6xl md:text-8xl font-bold font-serif text-amber-400/90">LICEO 8888</h1>
		</div>
		<div class="absolute bottom-0 left-0">
			<img src={buildingImage} alt="Building" class="h-full w-full object-contain" />
		</div>
	</div>
	<div class="relative col-span-10 flex h-full flex-col items-center p-6 pt-14 md:col-span-6">
		{@render children?.()}
	</div>
</div>
