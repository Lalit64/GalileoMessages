<script>
	export let name;
	export let deleteMes;
</script>

<div class='msg'>
	<div class='bubble'>
		<div class='txt'>
			<span class='name'>{name}</span>
			<span class='timestamp'>
				<svg
					on:click={() => deleteMes()}
					fill='none' height='20' stroke='currentColor'
					stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' width='20'
					xmlns='http://www.w3.org/2000/svg'>
					<path d='M0 0h24v24H0z' fill='none' stroke='none' />
					<line x1='4' x2='20' y1='7' y2='7' />
					<line x1='10' x2='10' y1='11' y2='17' />
					<line x1='14' x2='14' y1='11' y2='17' />
					<path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
					<path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
				</svg>
			</span>
			<span class='message'>
        <slot />
      </span>

		</div>
		<div class='bubble-arrow'></div>
	</div>
</div>

<style lang='scss'>

  .container {
    width: 75%;
    margin: 0 auto;
  }

  svg:hover {
    stroke: crimson;
  }


  .msg {
    width: 100%;
    height: auto;
    display: block;
    overflow: hidden;

    .bubble {
      float: left;
      max-width: 75%;
      min-width: 190px;
      width: auto;
      height: auto;
      display: block;
      background: #262d31;
      border-radius: 7.5px;
      position: relative;
      margin: 10px 0 3px 25px;
      box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.2);

      &.alt {
        margin: 10px 25px 3px 0px;
        background: #DCF8C6;
        float: right;
      }

      &.follow {
        margin: 2px 0 3px 25px;
      }

      &.altfollow {
        margin: 2px 25px 3px 0px;
        background: #DCF8C6;
        float: right;
      }

      .txt {
        padding: 8px 0 8px 0;
        width: 100%;

        .name {
          font-weight: 600;
          font-size: 14px;
          display: inline-table;
          padding: 0 0 0 15px;
          margin: 0 0 4px 0;
          color: #3498db;

          span {
            font-weight: normal;
            color: #b3b3b3;
            overflow: hidden;
          }

          &.alt {
            color: #2ecc51;
          }
        }

        .message {
          font-size: 14px;
          font-weight: 500;
          padding: 0 15px 0 15px;
          color: #c4c5c7;
          display: table;
        }

        .timestamp {
          font-size: 11px;
          margin: auto;
          padding: 0 15px 0 0;
          display: table;
          float: right;
          position: relative;
          text-transform: uppercase;
          color: #999
        }
      }

      .bubble-arrow {
        position: absolute;
        float: left;
        left: -11px;
        top: 0px;

        &.alt {
          bottom: 20px;
          left: auto;
          right: 4px;
          float: right;
        }
      }

      .bubble-arrow:after {
        content: "";
        position: absolute;
        border-top: 15px solid #262d31;
        border-left: 15px solid transparent;
        border-radius: 5px 0 5px 5px;
        width: 0;
        height: 0;
        margin-left: 2.8px;
        //box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
        //looks like I can't give a shadow to the arrows
      }

      .bubble-arrow.alt:after {
        border-top: 15px solid #DCF8C6;
        transform: scaleX(-1);
      }
    }
  }

  @media only screen and (max-width: 450px) {

    .container {
      width: 100%;
    }
    .timestamp {
      display: none;
      color: red;
    }
  }
</style>