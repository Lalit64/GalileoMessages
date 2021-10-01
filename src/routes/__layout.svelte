<slot />

<style global>
	@import "../globals.scss";
	@import "../../svelte-m-ui/bare.css";
	@tailwind base;
	@tailwind utilities;
	@tailwind components;
	@tailwind screens;


  /* Hide scrollbar for Chrome, Safari and Opera */
  *::-webkit-scrollbar {
      display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  * {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
  }

	body {
			transition: none !important;
			background: #252d33;
	}
</style>