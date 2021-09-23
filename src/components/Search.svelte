<script lang='ts'>
	import { clickOutside } from '../clickOutside';
	import { expoOut } from 'svelte/easing';

	function spin(node, { duration }) {
		return {
			duration,
			css: d => {
				const eased = expoOut(d);

				return `
					transform: rotate(${eased * 360}deg);`
			}
		};
	}

	function spinOp(node, { duration }) {
		return {
			duration,
			css: d => {
				const eased = expoOut(d);

				return `
					transform: rotate(${eased * -360}deg);`
			}
		};
	}

	let clicked = false;
</script>

<div style='border-bottom: 1px solid rgba(241,241,242,0.11); padding: 7px;'>
	<div class='input'>
		{#if clicked === true}
			<svg xmlns="http://www.w3.org/2000/svg" in:spin={{duration: 1000}} id='searchicon' width="26" height="26" fill="#838687" style='position: absolute; margin-left: -25px;' class="bi bi-arrow-left-short" viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
			</svg>
			{:else }
			<svg xmlns="http://www.w3.org/2000/svg" width="20" in:spin={{duration: 1000}} height="20" viewBox="0 0 24 24" fill='#838687' style='position: absolute; margin-left: -20px; margin-top: 1px;' ><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path></svg>
		{/if}
		<input placeholder='Search...' use:clickOutside on:clickOutside={() => clicked = false} on:click={() => {
			clicked = true;
		}} >
	</div>
</div>

<svelte:body />

<style lang='scss'>
  div {
    width: 100%;
    height: 50px;
    background: #131c21;
    padding: 5px 5px;
  }

  .input {
    border-radius: 100px;
    height: 100%;
    width: 100%;
    padding-left: 30px;
    background: #323739;
		color: #d4d5d7;
		display: flex;
		align-items: center;
		justify-content: flex-start;
  }

	input {
		width: 100%;
		height: 40px;
		margin-left: 4px;
		border-radius: 0 100px 100px 0;
		background: transparent;
    &:focus {
      outline: none;
    }
		font-size: 15px;
	}

  ::placeholder {
    color: #838687;
		opacity: 1;
  }
</style>