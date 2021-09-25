<script >
	import { createEventDispatcher } from 'svelte';
	import { supabase } from '../supabase';
	import axios from 'axios';

	let loading = true;
	let username = null;
	let avatar_url = null;
	let ip = null;

	export let path;
	let uploading = false;
	let src;
	let files;
	const dispatch = createEventDispatcher();

	async function getProfile() {
		try {
			loading = true;
			const user = supabase?.auth?.user();
			let {
				data,
				error,
				status
			} = await supabase.from('profiles').select(`username, avatar_url, ip`).eq('id', user.id).single();
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
			const res = await axios.get('https://geolocation-db.com/json/')
			const updates = { id: user.id, username, avatar_url, ip: res.data.IPv4 , updated_at: new Date() };
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
			<div class="_3D1Iu"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style='position: absolute; fill: currentColor; left: 65px; top: -30px;' ><path d="M12 9c-1.626 0-3 1.374-3 3s1.374 3 3 3 3-1.374 3-3-1.374-3-3-3z"></path><path d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5s2.29-5 5-5 5 2.29 5 5-2.29 5-5 5z"></path></svg>
				Change profile photo</div>
			<input accept='image/*'  tabindex='1' class='file' bind:files disabled={uploading} id='single' on:change={uploadAvatar}
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
    transition: 0.5s;
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
		&:hover {
			background-color: darken(#009688, 5);
		}
		&:active {
      background-color: darken(#009688, 7);
    }
  }


  ._3D1Iu {
    display: none;
  }

  .upload {
    margin-top: 10px;
    margin-bottom: 10px;
		display: flex;
		justify-content: center;
		&:hover {
      ._3D1Iu {
				display: flex;
        position: absolute;
        color: white;
        margin-top: 100px;
        margin-left: 20px;
        z-index: 1000000;
      }

			._3D1Iu:hover{
				color: transparent;
				fill: none !important;
			}
    }
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
		margin-left: -2px;
		margin-top: -2px;
		color: transparent;
    background: transparent;
		transition: background-color 0.5s;
		&:hover {
			color: rgba(0,0,0,0);
			background-color: rgba(0,0,0,0.3);
		}
		&:active {
      background-color: rgba(0,0,0,0.4);
		}
  }


</style>