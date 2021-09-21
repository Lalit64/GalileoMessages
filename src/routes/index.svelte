<script>
	import { supabase } from '../supabase';
	import Auth from '../components/Auth.svelte';
	import {user} from '../sessionStore';
	import Sidebar from '../components/Sidebar.svelte';

	let loading = true;
	let username = null;
	let website = null;
	let avatar_url = null;

	async function getProfile() {
		try {
			loading = true;
			const user = supabase?.auth?.user();
			let {
				data,
				error,
				status
			} = await supabase.from('profiles').select(`username, avatar_url`).eq('id', user.id).single();
			if (error && status !== 406) throw error;
			if (data) {
				username = data.username;
				avatar_url = data.avatar_url;
			}
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}


	async function updateProfile() {
		try {
			loading = true;
			const user = supabase.auth.user();
			const updates = { id: user.id, username, avatar_url, updated_at: new Date() };
			let { error } = await supabase.from('profiles').upsert(updates, {
				returning: 'minimal'
			});
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		try {
			loading = true;
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		} finally {
			loading = false;
		}
	}

</script>


{#if supabase.auth.user()?.email}
	<Sidebar />
{:else}
	<Auth type='signin' />
{/if}