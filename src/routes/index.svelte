<script lang="ts" >
	import { supabase } from '../supabase';
	import Auth from '../components/Auth.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';

	onMount(() => {

		if(supabase.auth.user()) {
			let loading = true;

			const updateProfile = async () => {
				try {
					loading = true;
					const user = supabase.auth.user();
					const res = await axios.get('https://geolocation-db.com/json/')
					const updates = { id: user.id, ip: res.data.IPv4, country_code: res.data.country_code };
					let { error } = await supabase.from('profiles').upsert(updates, {
						returning: 'minimal'
					});
					if (error) throw error;
				} catch (error) {

				} finally {
					loading = false;
				}
			}

			updateProfile()
		}
	})


</script>


{#if supabase?.auth?.user()}
	<Sidebar />
{:else}
	<Auth type='signin' />
{/if}