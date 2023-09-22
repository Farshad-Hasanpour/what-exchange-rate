<template>
	<div id="selected-card">
		<h2 id="header"></h2>
		<p id="description"></p>
	</div>
</template>

<script>
	export default {
		name: "SelectedCard",
		props:{
			rate: {required: true, type: Object},
			base: {required: true, type: String},
			symbols: {required: true, type: Object}
		}
	}
</script>

<style scoped>
	#selected-card{
		--items-per-row: 1;
		--horizontal-margin: 10px;

		width: calc((100% / var(--items-per-row)) - (2 * var(--horizontal-margin)));
		margin-bottom:20px;
		margin-left: var(--horizontal-margin);
		margin-right: var(--horizontal-margin);
		box-shadow: var(--color-line) 0px 2px 8px 0px;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding: 32px 10px;
		background-color: var(--color-card-back);
	}

	#title{ margin: 0; }
	#description{
		margin: 0;
		font-size: 14px;
		color: darkgray;
	}

	@media only screen and (min-width: 600px) {
		#selected-card{ --items-per-row: 2; }
	}

	@media only screen and (min-width: 960px) {
		#selected-card{ --items-per-row: 3; }
	}

	@media only screen and (min-width: 1264px) {
		#selected-card{ --items-per-row: 4; }
	}

	@media only screen and (min-width: 1904px) {
		#selected-card{ --items-per-row: 5; }
	}
</style>