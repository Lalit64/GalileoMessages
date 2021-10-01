<script>
	import ChannelListItem from './ChannelListItem.svelte';
	import { fade } from 'svelte/transition';
	import { supabase } from '../../supabase';
	import { onMount } from 'svelte';

	let direction = false;

	onMount(() => {
		direction = JSON.parse(localStorage.getItem('direction'))
	})
	let slugs = [];
	let id;
	let position;
	let open = false;

	(async () => {
		try {
			const user = supabase?.auth?.user();
			let {
				data
			} = await supabase.from('channels').select('slug, id').eq('get', 1);
			slugs = data;
		} catch (error) {
			alert(error.message);
		}

		localStorage.setItem('direction', JSON.stringify(direction))
		console.log(localStorage)
	})();

</script>

<div class='p-4 '>
	<button class='uppercase font-bold channels' on:click={() =>  {
		direction = !direction
		localStorage.setItem('direction', JSON.stringify(direction))
		console.log(localStorage)
	}}>
		<svg class="arrow-gKvcEx icon-2yIBmh {direction === true ? 'right': null} arr" viewBox='0 0 24 24'>
			<path clip-rule='evenodd' d='M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z' fill='currentColor'
						fill-rule='evenodd'></path>
		</svg>
		Channels
	</button>
	{#if direction === false}
		<div class='mt-2' transition:fade={{ duration: 100 }}>
			{#each slugs as slug}
				<ChannelListItem style='width: 100%; height: 100%;' value={slug.slug} onClick={() => {
					location.replace(`/channels/${slug.id}`)
				}}>
					<button
						style='width: 100%; height: 100%; display: flex; justify-content: flex-end; align-items: center; padding: 10px;'>
						<div class='svg' on:click={async () => {
								await supabase.from('channels').delete().eq('id', slug.id)
								location.reload()
							}}>
							<svg
									 xmlns='http://www.w3.org/2000/svg' width='20' height='20'
									 viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' fill='none' stroke-linecap='round'
									 stroke-linejoin='round'>
								<path stroke='none' d='M0 0h24v24H0z' fill='none' />
								<line x1='4' y1='7' x2='20' y2='7' />
								<line x1='10' y1='11' x2='10' y2='17' />
								<line x1='14' y1='11' x2='14' y2='17' />
								<path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
								<path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
							</svg>
						</div>
					</button>
				</ChannelListItem>
			{/each}
		</div>
	{/if}

</div>

<style lang='scss'>
  * {
    transition: .5s;
  }

  .channels {
    color: #7c7f80;
    font-size: 13px;
    display: flex;

    &:hover {
      color: #cccdcf;
    }
  }

	.svg {
		display: flex;
		align-items: center;
		justify-content: center;
    height: 35px;
    width: 40px;
    margin-right: -10px;
    transition: none;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
    &:hover {
			background: crimson;
			color: white;
		}
	}

  .arr {
    width: 20px;
    height: 20px;
    margin-bottom: -1px;
  }

  .right {
    transform: rotate(-90deg);
  }

	.canc {
    color: #7c7f80;
    font-size: 13px;
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 16px;
    border-radius: 7px;
    width: 75px;
    &:hover {
      color: #cccdcf;
      background: #323739;
    }
	}

	.del {
    color: #7c7f80;
    font-size: 13px;
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 18px;
    border-radius: 7px;
    width: 75px;
    &:hover {
      color: #cccdcf;
      background: rgba(220, 20, 60, 0.1);
    }
	}

</style>