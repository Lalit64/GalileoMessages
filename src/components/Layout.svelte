<script>
	import Sidebar from './Sidebar.svelte';

</script>

<div class='flex h-screen w-screen'>
	<Sidebar />
	<div class='h-screen w-full flex-1'>
		<slot />
	</div>
</div>


