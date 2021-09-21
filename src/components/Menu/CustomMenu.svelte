<script lang='ts'>
	import MenuDivider from './MenuDivider.svelte';
	import { supabase } from '../../supabase';

</script>

<div class='menutop mdc-menu-surface mdc-menu-surface--open mdc-menu-surface--is-open-below' style='transform-origin: top center 0px;'>
	<div class='menu pt-2 pb-2 flex flex-col s-G1Ow7ZVQ9xTC'>
		<button on:click|preventDefault={() => {
					document.execCommand('copy')
				}} class='list'>
			Copy
		</button>
		<button on:click={() => {
					document.execCommand('paste')
				}} class='list'>
			Paste
		</button>
		<button on:click={() => window.history.go(-1)} class='list'>
			Back
		</button>
		<button on:click={() => window.history.go(1)} class='list'>
			Forward
		</button>
		<button on:click={() => location.reload()} class='list'>
			Reload
		</button>
		{#if supabase.auth.user()}
			<MenuDivider />
			<slot />
			<button on:click={() => {
					supabase.auth.signOut()
					location.reload()
				}} class='list'>
				Log out
			</button>
		{/if}
	</div>
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