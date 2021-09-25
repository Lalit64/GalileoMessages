<script lang="ts">
	import logo from "../icons/logo.svg"
	import { supabase } from '../supabase';

	export let type = "";

	let email;
	let password;
	let loading = false;
	let success = "";

	const signIn = async () => {
		try {
			loading = true;
			const {error} = await supabase.auth.signIn({email: email, password: password})
			if(error) throw error;
		} catch (error) {
			alert(error.message)
		} finally {
			loading = false;
			location.reload()
		}
	}

	async function googleIn() {  const { user, session, error } = await supabase.auth.signIn({provider: 'google'});}

	async function githubIn() {  const { user, session, error } = await supabase.auth.signIn({provider: 'github'});}


	const signUp = async () => {
		try {
			loading = true;
			const {error} = await supabase.auth.signUp({email: email, password: password})
			if(error) throw error;
			let emailLink = "Check your email for the login link!"
		} catch (error) {
			alert(error.message)
		} finally {
			loading = false;
			location.reload()
		}
	}

</script>
<svelte:head>
	{#if type === "signin"}
		<title>
			GalileoMessages | Sign In
		</title>
	{:else if type === "signup"}
		<title>
			GalileoMessages | Sign Up
		</title>
	{/if}
</svelte:head>
<div class='screen flex items-center justify-center'>
	<form class='inner-container w-3/12 h-3/5 flex items-center justify-center flex-col' on:submit|preventDefault={type === "signin" ? signIn : signUp} >
		<img src={logo} width='200px' class='mb-10' />
		<div class='w-3/6 flex'>
			<button class='social' type='button' on:click={googleIn} >
				<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width='32px'><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
			</button>
			<button class='social' type='button' on:click={githubIn} >
				<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="32px" height="32px">    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z"/></svg>
			</button>
		</div>
		<div class="divider">
			<span>or</span>
		</div>
		<input placeholder='Email' type='email' bind:value={email}>
		<input placeholder='Password' type='password' bind:value={password}>
		<button type='submit' >
			{#if type === "signin"}
				Sign In
			{:else if type === "signup"}
				Sign Up
			{/if}
		</button>
		{#if type === "signin"}
			<a href='/signup' >Don't Have an Account? Sign Up</a>
		{:else if type === "signup"}
			<a href='/signin' >Have an Account? Sign In</a>
		{/if}
	</form>
</div>

<style lang='scss'>
	button,input {
		transition: 0.5s;
	}

	.inner-container {
			background-color: #32373B;
			border-radius: 20px;
	}

	input {
			@apply rounded w-3/6 h-9 p-6 pl-4 m-3.5;
			background: #3B4447;
			color: #c1cbd4;
	}

	input:active {
    background: linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  }

  .divider{
      background: #3B4447;
      height: 2px;
      display: block;
      position: relative;
      width: 50%;
      margin: 30px auto;
  }
  .divider span{
      width: 30px;
      height: 20px;
      background: #32373b;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      top: -12px;
      text-align: center;
      color: #c1cbd4;
  }

	button {
      @apply rounded w-3/6 h-9 p-6 pl-4 m-3.5 flex items-center justify-center;
      background: #3B4447;
      color: #c1cbd4;
	}

	button:active {
		background: linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
	}

	button[class="social"] {
			@apply w-1/2;
			color: #c1cbd4;
			.icn {
				fill: #c1cbd4;
			}
	}

	a {
    color: #c1cbd4;
	}
</style>