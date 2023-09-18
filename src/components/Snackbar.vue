<template>
	<div
		id="snackbar"
		:class="[
			$store.state.snackbar.message && $store.state.snackbar.show ? 'visible' : '',
			$store.state.snackbar.messageType
		]"
	>
		<span class="message">{{$store.state.snackbar.message}}</span>
		<Button class="close" type="icon" depressed @click="$store.dispatch('closeMessage')">
			<Icon name="close" title="Close"/>
        </Button>
	</div>
</template>

<script>
	export default {
		name: "Snackbar",
	}
</script>

<style scoped>
	#snackbar{
		--sides: 20px;
		display: flex;
		position: fixed;
		top: var(--sides);
		left: var(--sides);
		margin-inline-end: var(--sides);
		max-width: 280px;
		overflow: hidden;
		color: white;
		padding: 16px 24px;
		font-size: 16px;
		z-index: 1000;
		border: 4px solid white;
		border-radius: 12px;
		box-shadow: 0 0 10px 0 var(--color-line);
		align-items: center;
		justify-content: space-between;
		opacity: 0;
		user-select: none;
		transform: translateY(-100px);
		transition: transform var(--animation-speed), opacity var(--animation-speed);
	}
	#app-wrapper[rtl] #snackbar{
		left: unset;
		right: var(--sides);
	}
	#snackbar.visible{ opacity: 1; transform: translateY(0);}
	#snackbar.error{ background-color: var(--color-error); }
	#snackbar.success{ background-color: var(--color-success); }
	#snackbar .close{
		margin-inline-start: 20px;
	}
	#snackbar.visible .close{ cursor: pointer; }

	@media only screen and (min-width: 600px) {
		#snackbar {
			max-width: unset;
			min-width: 310px;
		}
	}
</style>