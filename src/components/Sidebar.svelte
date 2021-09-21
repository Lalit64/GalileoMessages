<script lang='ts'>
	import { supabase } from '../supabase';
	import MenuSurface, { MenuSurfaceComponentDev } from '@smui/menu-surface';
	import Menu from './Menu/Menu.svelte';
	import Settings from './Settings.svelte';
	import CustomMenu from './Menu/CustomMenu.svelte';

	let surface: MenuSurfaceComponentDev;

	let loading = true;
	let username = null;
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
	let pos = { x: 0, y: 0 };
	let showMenu = false;


	async function onRightClick(e) {
		if (showMenu) {
			showMenu = false;
			await new Promise(res => setTimeout(res, 100));
		}

		pos = { x: e.clientX, y: e.clientY };
		showMenu = true;
	}

	function closeMenu() {
		showMenu = false;
	}
</script>

<svelte:head>
	<title>
		GalileoMessages | Home
	</title>
</svelte:head>

<svelte:body on:contextmenu|preventDefault={onRightClick} />

{#if showMenu}
	<Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
		<CustomMenu>
			<button on:click={() => {
					shown=!shown;
					console.log(shown)
				}} class='list'>
				Settings
			</button>
		</CustomMenu>
	</Menu>
{/if}

{#if supabase.auth.user()?.email}
	<div class='screen flex'>
		<div class='sidebar drawer' class:shown={shown}>
			<div
				style='width: 100%; height: 105px; background: #323739; display: flex; align-items: flex-end; padding: 10px;'>
				<button class='close' on:click={() => {
							shown=!shown;
					}}>
					<svg viewBox='0 0 24 24' width='24' height='24' class=''>
						<path fill='currentColor' d='M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z'></path>
					</svg>
				</button>
				<h1
					style='width: 32px; height: 32px; align-items: center; justify-content: center; color: #e1e1e3; padding-left: 10px;'>
					Settings
				</h1>
			</div>
			<Settings />
		</div>
		<div class='sidebar'>
			<div class='header' use:getProfile on:submit|preventDefault={updateProfile}>
				<div class='avatar'>
					{#if publicURL }
						{#if publicURL === null} Loading...{:else }  <img src={publicURL} on:click={() => shown=!shown} />{/if}
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
					<button class='btn' disabled>

					</button>
					<button class='btn'>
						<svg viewBox='0 0 24 24' width='24' height='24' class=''>
							<path fill='currentColor'
										d='M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z'></path>
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
							<button on:click={() => {
								navigator.clipboard.writeText(supabase.auth.user().id)
							}} class='list'>
								Copy User ID
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
  * {
    transition: 0.5s;
  }

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
    width: 200px;
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
    transition: .5s;
  }

  .shown {
    left: 0;
    transition: .5s;
  }

  .close {
    border-radius: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    color: #b1b3b5;


    &:hover {
      backdrop-filter: brightness(80%);
    }

    &:active {
      backdrop-filter: brightness(60%);
    }
  }

  .btn[disabled] {
    cursor: default;

    &:hover {
      backdrop-filter: brightness(100%);
    }

    &:active {
      backdrop-filter: brightness(100%);
    }
  }
</style>