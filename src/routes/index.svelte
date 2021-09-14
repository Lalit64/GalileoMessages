<script>
	import {supabase} from '../supabase';
	import Auth from '../components/Auth.svelte';
</script>

{#if supabase.auth.user()?.email}
	<div class='screen'>

	</div>
	{:else}
	<Auth type='signin' />
{/if}