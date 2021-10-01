import { writable } from 'svelte/store';
import { supabase } from './supabase';
export const user = writable(false);

export const addChannel = async (slug, user_id) => {
	try {
		let { body } = await supabase.from('channels').insert([{ slug, created_by: user_id }]);
		return body;
	} catch (error) {
		alert(error);
	}
};
