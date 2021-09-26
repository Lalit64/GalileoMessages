<script lang='ts'>
	import MenuDivider from './MenuDivider.svelte';
	import { supabase } from '../../supabase';
	import Menu from './Menu.svelte';

	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let x;
	export let y;
	export let close;

	$: (() => {
		if (!menuEl) return;

		const rect = menuEl.getBoundingClientRect();
		x = Math.min(window.innerWidth - rect.width, x);
		if (y > window.innerHeight - rect.height) y -= rect.height;
	})(x, y);

	const dispatch = createEventDispatcher();

	let menuEl;

	function onPageClick(e) {
		if (e.target === menuEl || menuEl.contains(e.target)) return;
		dispatch('clickoutside');
	}
</script>

<svelte:body on:click={onPageClick} />


<div class='menutop mdc-menu-surface mdc-menu-surface--open mdc-menu-surface--is-open-below' transition:fly={{ duration: 150 }} bind:this={menuEl} style='transform-origin: top center 0px;top: {y}px; left: {x}px;'>
	<Menu class='menu pt-2 pb-2 flex flex-col' >
		<button on:click|preventDefault={() => {
					document.execCommand('copy')
					close()
				}} class='list'>
			Copy
		</button>
		<button on:click={() => {
					document.execCommand('paste')
					close()
				}} class='list'>
			Paste
		</button>
		<button on:click={() => {
			window.history.go(-1)
			close()
		}} class='list'>
			Back
		</button>
		<button on:click={() => {
			window.history.go(1)
			close()
		}} class='list'>
			Forward
		</button>
		<button on:click={() => {
			location.reload()
			close()
		}} class='list'>
			Reload
		</button>
		{#if supabase.auth.user()}
			<MenuDivider />
			<slot />
			<button on:click={() => {
					supabase.auth.signOut()
					location.reload()
					close()
				}} class='list'>
				Log out
			</button>
		{/if}
	</Menu>
</div>

<style>
    * {
        transition: 0.5s;
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