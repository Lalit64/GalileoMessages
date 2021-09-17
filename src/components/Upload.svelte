<script>  import { createEventDispatcher } from 'svelte';
import { supabase } from '../supabase';
import EditProfile from './EditProfile.svelte';

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

let hide = false;
</script>
<div class='all'>
	{#if data.publicURL}
		<div class='w-full h-full flex flex-col items-center secondary drawer' use:getProfile class:hide={!hide} on:click={() => {
				hide=!hide
			}}>
			<button class='profile' >
				<img src={data.publicURL} class='mb-8 avatar '  alt=''/>
				<div class='flex flex-col self-center relative bottom-1 text' style='height: 41px; width: 100%; color: #e1e2e3; font-size: 19px; text-align: left; margin-left: 10px;'>
					<h1>
						{#if username === null} Loading... {:else }	{username} {/if}
					</h1>
					<h6 style='color: #8d8f92; font-size: 15px;'>
						{avatar_url}
					</h6>
				</div>
			</button>
		</div>
		<div class:hide={hide} class='w-full h-full flex flex-col items-center secondary' >
			<EditProfile />
			<button class='close' on:click={() => {
				hide=!hide
			}} >
				<svg viewBox="0 0 24 24" width="24" height="24" class=""><path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path></svg>
			</button>
		</div>
	{/if}
</div>

<style lang='scss'>

  * {
    transition: 0.5s;
  }
  .all {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }

	.profile {
		width: 100%;
		height: 115px;
		display: flex;
		padding: 15px;
		&:hover{
			background: #2d3134;
		}
	}

  img {
    border-radius: 100%;
    width: 82px;
    height: 82px;
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

  .close {
    border-radius: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 10px;
    top: 120px;
    transition: 0.5s;
    color: #b1b3b5;

    &:hover {
      backdrop-filter: brightness(80%);
    }

    &:active {
      backdrop-filter: brightness(60%);
    }
  }

  .drawer {
    position: absolute;
    z-index: 1;
		background: #131c21;
    width: 100%;
    left: -200%;
    min-width: 300px;
    box-shadow: 4px 17px 72px -24px rgba(0, 0, 0, 0.9);
    height: 100vh;
    transition: .5s;
  }


  .hide {
    left: 0;
    transition: .5s;
  }
</style>