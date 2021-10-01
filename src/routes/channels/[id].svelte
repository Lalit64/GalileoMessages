<script context='module'>

	export const load = ({ page }) => {
		const id = page.params.id;

		return {
			props: {
				id
			}
		};
	};
</script>

<script>
	import Layout from '../../components/Layout.svelte';
	import { supabase } from '../../supabase';
	import Message from '../../components/Message.svelte';
	import moment from "moment"

	export let id;

	let messages = [];
	let username;
	let messageValue;

	async function getProfile() {
		try {
			const user = supabase?.auth?.user();
			let {
				data,
				error,
				status
			} = await supabase.from('profiles').select(`username, avatar_url, ip`).eq('id', user?.id).single();
			if (error && status !== 406) throw error;
			if (data) {
				username = data.username;
			}
		} catch (error) {
			console.log(error.message)
		} finally {

		}
	}

	getProfile()

	const newMessage = async () => {
		await supabase.from('messages').insert({ inserted_at: new Date(), message: messageValue	, user_id: supabase.auth.user().id, channel: id, user_name: username })
		location.reload()
	}

	(async () => {
		try {
			let {
				data
			} = await supabase.from('messages').select('id, message, channel, user_name').eq('channel', id);
			messages = data;
		} catch (error) {
			console.log(error.message)
		}
	})();

</script>

<Layout class='layout'>
	<div class='w-full messages'>
		{#each messages as message}
			<Message name={message.user_name} deleteMes={async () => {
				await supabase.from('messages').delete().eq('id', message.id)
				location.reload()
			}} >
				{message.message}
			</Message>
		{/each}
	</div>
	<form class='message-container' on:submit|preventDefault={newMessage} >
		<input class='message-input' bind:value={messageValue} placeholder='Type A Message'>
	</form>
</Layout>

<style>
    .message-container {
        width: 100%;
        height: 60px;
        background: #1e2428;
        border-top: 2px solid #2a3236;
        display: flex;
        position: sticky;
        vertical-align: bottom;
        align-items: center;
        justify-content: space-between;
        padding-left: 15px;
        padding-right: 15px;
    }

    .message-input {
        border-radius: 100px;
        height: 40px;
        width: 100%;
        padding-left: 20px;
        background: #33383b;
        font-size: 14px;
        color: #e7e7e8;
    }

    .messages {
        background: #101012;
        height: calc(100% - 60px);
    }
</style>