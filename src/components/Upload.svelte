<script>  import { createEventDispatcher } from 'svelte';
import { supabase } from '../supabase';

export let path;
export let size = '10em';
let uploading = false;
let src;
let files;
let loading = true;
let username = null;
let avatar_url = null;
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

async function uploadAvatar() {
	try {
		uploading = true;
		if (!files || files.length === 0) {
			throw new Error('You must select an image to upload.');
		}
		const file = files[0];
		const fileName = `${supabase.auth.user().id}`;
		const filePath = `${fileName}`;
		let { error: uploadError } = await supabase.storage.from('avatars').upload(`avatars/${filePath}`, file);
		if (uploadError) throw uploadError;
		path = filePath;
		dispatch('upload');
	} catch (error) {
		alert('Please Delete your profile before you change to a new one.');
	} finally {
		uploading = false;
		location.reload();
	}
}

const deleteAvatar = async () => {
	await supabase.storage.from('avatars').remove(['avatars/4ce7bb49-7397-4f5b-a104-5736f83b113f']);
	location.reload();
};

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
		location.reload();
	}
}


const { data, error } = supabase.storage.from('avatars').getPublicUrl(`avatars/${supabase.auth.user().id}`);

</script>
<div class='all'>
	{#if data.publicURL}
		<div class='w-full h-full flex flex-col items-center'>
			<img src={data.publicURL} style='height: {size}; width: {size};' class='mb-8 avatar ' />
			<div class='flex flex-col items-center justify-center w-full'>
				<div class='flex'>
					<label class='button primary block cursor-pointer'
								 for='single'>{uploading ? 'Loading...' : 'Upload'}
					</label>
					<button class='button' on:click={deleteAvatar}>{uploading ? 'Loading...' : 'Delete'}</button>
				</div>
					{#if supabase.auth.user().email}
						<form class='flex flex-col w-full items-center' on:submit|preventDefault={updateProfile} >
							<input value={supabase.auth.user().email} disabled type='email'>
							<input placeholder='Username' bind:value={username}>
							<button class='input flex items-center justify-center' type='submit'>
								{!loading ? 'Loading...' : 'Update'}
							</button>
						</form>

					{/if}
			</div>
		</div>
		<input
			accept='image/*' bind:files disabled={uploading} id='single' on:change={uploadAvatar}
			style='visibility: hidden; position:absolute;' type='file' />
	{:else}
		<div class='avatar' style='height: {size}; width: {size};'>
			Please Upload an image to use
		</div>
		<label class='button primary block'
					 for='single'>{uploading ? 'Uploading ...' : 'Upload'}
		</label>
		<input
			accept='image/*' bind:files disabled={uploading} id='single' on:change={uploadAvatar}
			style='visibility: hidden; position:absolute;' type='file' />
	{/if}
</div>

<style lang='scss'>
  .all {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }

  img {
    border-radius: 100%;
    width: 50px;
    height: 50px;
  }

  .button {
    @apply rounded;
    width: 110px;
    height: 50px;
    background-color: #2a2f32;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 5px;
  }

  .button:hover {
    background-color: darken(#DC143C, 10);
  }

  label.button:hover {
    background-color: darken(#2a2f32, 5);
  }

  button.button {
    background-color: crimson;
  }

  input, .input {
    @apply rounded w-1/2 h-9 p-6 pl-4 m-3.5;
    background: #3B4447;
    color: #c1cbd4;
  }

  input:active, .input:active {
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  }

  input[disabled] {
    background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  }


</style>