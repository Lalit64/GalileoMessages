<script>
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '../supabase';

	let loading = true;
	let username = null;
	let avatar_url = null;

	export let path;
	let uploading = false;
	let src;
	let files;
	const dispatch = createEventDispatcher();

	async function getProfile() {
		try {
			loading = true;
			const user = supabase.auth.user();
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
			location.reload();
		}
	}

	async function uploadAvatar() {
		try {
			uploading = true;
			await supabase.storage.from('avatars').remove([`avatars/${supabase.auth.user().id}`]);
			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}
			const file = files[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `avatars/${supabase.auth.user().id}`;
			let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
			if (uploadError) throw uploadError;
			path = filePath;
			dispatch('upload');
		} catch (error) {
			alert(error.message);
		} finally {
			uploading = false;
			location.reload()
		}
	}

	const { data, error } = supabase.storage.from('avatars').getPublicUrl(`avatars/${supabase.auth.user().id}`);

</script>

<div class='w-full h-full flex flex-col items-center p-9' use:getProfile>
	<div class='upload'>
		<form>
			<input accept='image/*' tabindex='1' class='file' bind:files disabled={uploading} id='single' on:change={uploadAvatar}
						 style='border-bottom: 0;' type='file' />
		</form>
		<img class='mb-1 avatar' src={data.publicURL} />
	</div>
	<div class='w-full'>
		<form on:submit|preventDefault={updateProfile}>
			<h1>
				Username
			</h1>
			<input bind:value={username} class='w-full h-14 bg-transparent text-white text-left ' placeholder='Username'>
			<h1 class='mt-10'>
				About
			</h1>
			<input bind:value={avatar_url} class='w-full h-14 bg-transparent text-white text-left' placeholder='About'>
			<button class='w-1/2 h-10 mt-10 rounded' type='submit'>
				Continue
			</button>
		</form>
	</div>
</div>
<style lang='scss'>
  * {
    transition: .5s;
  }

  h1 {
    color: #009688;
  }

  img {
    width: 200px;
    height: 200px;
    border-radius: 200px;
  }

  input {
    border-bottom: 1px solid #009688;

    &:focus {
      outline: 0;
    }
  }

  button {
    color: white;
    background: #009688;
  }

  .upload {
    margin-top: 10px;
    margin-bottom: 10px;
  }

	.file {
		position: absolute;
		width: 200px;
		height: 200px;
		border-radius: 200px;
	}

	::file-selector-button {
		width: 105%;
		height: 105%;
		color: transparent;
    background: transparent;
		&:hover {
			color: white;
			background: rgba(0,0,0,0.3);
		}
  }
</style>