<script lang='ts'>
	import { supabase } from '../supabase';
	import MenuSurface, { MenuSurfaceComponentDev } from '@smui/menu-surface';
	import Settings from './Settings.svelte';

	let surface: MenuSurfaceComponentDev;

	let loading = true;
	let username = null;
	let website = null;
	let avatar_url = null;
	let isOpen = false;

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

	let shown = false;
	const { publicURL, error } = supabase.storage.from('avatars').getPublicUrl(`avatars/${supabase.auth.user().id}`);
</script>

{#if supabase.auth.user()?.email}
	<div class='screen flex'>
		<div class='sidebar drawer' class:shown={shown}>
			<button class='close' on:click={() => {
							shown=!shown;
					}}>
				<svg viewbox='0 0 40 40' width='11'>
					<path class='close-x' d='M 10,10 L 30,30 M 30,10 L 10,30' />
				</svg>
			</button>
			<Settings />
		</div>
		<div class='sidebar'>
			<div class='header' use:getProfile on:submit|preventDefault={updateProfile}>
				<div class='avatar'>
					{#if publicURL }
						<img src={publicURL} />
					{:else}
						<div class='MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault'>
							<svg class='MuiSvgIcon-root MuiAvatar-fallback' width='30' height='30' fill='white' focusable='false'
									 viewBox='0 0 24 24' aria-hidden='true'>
								<path
									d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'></path>
							</svg>
						</div>
					{/if}
				</div>
				<div class='icons items-center absolute right-4 w-2/6 h-full flex justify-between'>
					<button class='btn'>
						<svg viewBox='0 0 24 24' width='24' height='24' class=''>
							<path fill='currentColor'
										d='M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z'></path>
						</svg>
					</button>
					<button class='btn'>
						<svg viewBox='0 0 24 24' width='24' height='24' class=''>
							<path fill='currentColor'
										d='M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z'></path>
						</svg>
					</button>

					<button class='btn' on:click={() => surface.setOpen(!isOpen)}>
						<svg viewBox='0 0 24 24' width='24' height='24' class=''>
							<path fill='currentColor'
										d='M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z'></path>
						</svg>
					</button>
					<MenuSurface bind:this={surface} class='menutop' anchorCorner='BOTTOM_LEFT'>
						<div
							class='menu pt-2 pb-2 flex flex-col'
						>
							<button class='list'>
								New Chat
							</button>
							<button class='list' id='settings' on:click={() => {
								shown = !shown;
								surface.setOpen(false)
									console.log(shown)
							}}>Settings
							</button>
							<button class='list l' on:click={() => {
								supabase.auth.signOut().then(() => {location.reload()})
							}}>Log out
							</button>
						</div>
					</MenuSurface>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang='scss'>
  .sidebar {
    width: 18%;
    min-width: 300px;
    background: #131c21;
  }

  .header {
    padding: 10px 16px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    background: #2a2f32;
    z-index: 100;
    box-shadow: -1px 17px 2000px 0px rgba(0, 0, 0, 0.2);

    .avatar {
      img {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transition: opacity .15s ease-out;
        border-radius: 50%;
      }

      position: absolute;
      left: 16px;
      height: 40px;
      width: 40px;
      cursor: pointer;
    }
  }

  .MuiAvatar-colorDefault {
    color: #121212;
    background-color: #bdbdbd;
  }

  .MuiAvatar-root {
    width: 40px;
    height: 40px;
    display: flex;
    overflow: hidden;
    position: relative;
    font-size: 1.25rem;
    align-items: center;
    flex-shrink: 0;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    line-height: 1;
    border-radius: 50%;
    justify-content: center;
    -moz-user-select: none;
  }

  .btn {
    border-radius: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    color: #b1b3b5;
  }

  .btn:hover {
    backdrop-filter: brightness(80%);
  }

  .menu {
    background-color: #2a2f32 !important;
  }

  .list {
    height: 40px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: left;
    padding-left: 20px;
    color: #b1b3b5;
    font-size: 14.5px;
  }

  .list:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .list:active {
    background-color: rgba(0, 0, 0, 0.4);
  }

  .drawer {
    position: absolute;
    z-index: 1;
    width: 18%;
		left: -200%;
    min-width: 300px;
    box-shadow: 4px 17px 72px -24px rgba(0, 0, 0, 0.9);
    height: 100vh;
    transition: .3s;
  }

  .shown {
		left: 0;
  }

  .close {
    width: 25px;
    height: 25px;
    border-radius: 30%;
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    right: 20px;
    top: 80px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    .close-x {
      stroke: white;
      fill: transparent;
      stroke-linecap: round;
      stroke-width: 5;
    }

    &:hover {
      backdrop-filter: brightness(80%);
    }

    &:active {
      backdrop-filter: brightness(60%);
    }
  }
</style>