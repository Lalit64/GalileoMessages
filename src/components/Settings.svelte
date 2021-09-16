<script>
	import Upload from './Upload.svelte';
	import {supabase} from '../supabase';
</script>

<div class='settings'>
	<div class='w-full h-3/5 flex flex-col items-center '>
		<Upload />
	</div>
</div>

<style>
	.settings {
			width: 100%;
			height: 100%;
			padding-top: calc(60px + (65px));
			display: flex;
	}

  input {
      @apply rounded w-1/2 h-9 p-6 pl-4 m-3.5;
      background: #3B4447;
      color: #c1cbd4;
  }

  input:active {
      background: linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  }

	input[disabled] {
      background: linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
	}
</style>