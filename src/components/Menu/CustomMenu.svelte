<script lang='ts'>
	import Menu from './Menu.svelte';
	import MenuDivider from './MenuDivider.svelte';
	import { supabase } from '../../supabase';

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

	let zooom = 1;
</script>

{#if showMenu}
	<Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
		<div class='menutop mdc-menu-surface mdc-menu-surface--open mdc-menu-surface--is-open-below' style='transform-origin: top center 0px;'>
			<div class='menu pt-2 pb-2 flex flex-col s-G1Ow7ZVQ9xTC'>
				<button on:click={() => window.history.go(-1)} class='list'>
					Back
				</button>
				<button on:click={() => window.history.go(1)} class='list'>
					Forward
				</button>
				<button on:click={() => location.reload()} class='list'>
					Reload
				</button>
				<MenuDivider />
				<button on:click={() => {
					supabase.auth.signOut()
					location.reload()
				}} class='list'>
					Log out
				</button>
			</div>
		</div>
	</Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />


<style>
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
				color: #dbdcdd;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .list:active {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .mdc-menu-surface {
        background-color: #2a2f32 !important;
    }
</style>