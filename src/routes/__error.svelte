<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				status: status
			}
		};
	}
</script>

<script>
	import { supabase } from '../supabase';

	export let status;
</script>

<div class='w-screen h-screen flex-col flex screen'>
	{#if status == 404} <!-- Used '==' instead of '===' to match string/number status code (just to be sure) -->
		<div class="glitch" data-text="404" aria-hidden='true' >
			{status}
		</div>
		<h3 class='text-2xl font-semibold text-gray-300'>
			Congrats, You broke the Internet!
		</h3>
		<p class='w-1/4 text-gray-400 mt-4'>
			That's so 1939. Galileo is secretly powered by quantum robot bunnies. Technology is wild, isn't it? Anyway, you look lost. <br> Here are a few suggested pages.
		</p>
		<a href='/' class='first font-semibold' >
			Home Page
		</a>
		<a href='https://galileoxp.com' class=' font-semibold' >
			Galileo's Website
		</a>
		<a on:click={() => {
			supabase.auth.signOut()
			location.replace('/')
		}} class=' font-semibold' >
			Log out
		</a>
	{:else}
		<div class="glitch" data-text="500" aria-hidden='true' >
			{status}
		</div>
		<h3 class='text-2xl font-semibold text-gray-300'>
			Oh No, Internal Server Error!
		</h3>
		<p class='w-1/4 text-gray-400 mt-4'>
			That's so 1939. Galileo is secretly powered by quantum robot bunnies. Technology is wild, isn't it? Anyway, it's probably a one time error. <br> Here are a few suggested pages.
		</p>
		<a on:click={() => {
			location.reload()
		}} class='first font-semibold' >
			Reload The page
		</a>
		<a href='https://galileoxp.com' class=' font-semibold' >
			Galileo's Website
		</a>
		<a on:click={() => {
			supabase.auth.signOut()
			location.replace('/')
		}} class=' font-semibold' >
			Log out
		</a>
	{/if}
</div>

<style lang='scss'>
		.screen {
				padding-left: 20%;
				justify-content: center;
		}

		a {
			color: #502ee0;
			&:hover {
				text-decoration: underline;
			}
			margin-top: 10px;
		}

    .first {
      margin-top: 20px;
    }

    .glitch {
        font-size: 8rem;
        font-weight: 700;
        text-transform: uppercase;
        position: relative;
    }

    .glitch span {
        position: absolute;
        top: 0;
        left: 0;
    }


    @keyframes noise-anim {
      $steps: 20;
      @for $i from 0 through $steps {
        #{percentage($i*(1/$steps))} {
          $top: random(100);
          $bottom: random(101 - $top);
          $topWithPercent: $top * 1%;
          $bottomWithPercent: $bottom * 1%;
          clip-path: inset(#{$topWithPercent} 0 #{$bottomWithPercent} 0);
        }
      }
    }
    .glitch::after {
      content: attr(data-text);
      position: absolute;
      left: 2px;
      text-shadow: -1px 0 red;
      top: 0;
      color: white;
      background: transparent;
      overflow: hidden;
      animation: noise-anim 2s infinite linear alternate-reverse;
    }

    @keyframes noise-anim-2 {
      $steps: 20;
      @for $i from 0 through $steps {
        #{percentage($i*(1/$steps))} {
          $top: random(100);
          $bottom: random(101 - $top);
          $topWithPercent: $top * 1%;
          $bottomWithPercent: $bottom * 1%;
          clip-path: inset(#{$topWithPercent} 0 #{$bottomWithPercent} 0);
        }
      }
    }
    .glitch::before {
      content: attr(data-text);
      position: absolute;
      left: -2px;
      text-shadow: 1px 0 blue;
      top: 0;
      color: white;
      background: #252d33;
      overflow: hidden;
      animation: noise-anim-2 15s infinite linear alternate-reverse;
    }

</style>