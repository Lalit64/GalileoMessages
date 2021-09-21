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

    * {
        transition: ease-in-out .5s;
    }

	.settings {
			width: 100%;
			height: calc(100% - 105px);
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
    }
</style>