<template>
	<div class="selected-card">
		<Icon name="swap-vertical" size="46px" class="icon flex-shrink-0" color="var(--color-placeholder)"/>
		<div class="info">
			<h2 class="header">{{rate.value}} <small class="small">{{symbols[rate.id].description}}</small></h2>
			<h2 class="header">1 <small class="small">{{symbols[base].description}}</small></h2>
		</div>
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
	.selected-card{
		--items-per-row: 1;
		--horizontal-margin: 10px;

		width: calc((100% / var(--items-per-row)) - (2 * var(--horizontal-margin)));
		margin-bottom:20px;
		margin-left: var(--horizontal-margin);
		margin-right: var(--horizontal-margin);
		box-shadow: var(--color-line) 0px 2px 8px 0px;

		display: flex;
		align-items: center;
		padding: 32px 10px;
		background-color: var(--color-card-back);
	}

	.info{
		display: flex;
		flex-direction: column;
		height: 100%;
		flex-grow: 1;
	}
	.header{
		font-size: 24px;
		font-weight: bold;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 100%;
	}
	.small{
		font-size: 14px;
		font-weight: lighter;
	}
	.icon{
		margin-left: 16px;
		margin-right: 16px;
	}

	@media only screen and (min-width: 600px) {
		.selected-card{ --items-per-row: 2; }
	}

	@media only screen and (min-width: 960px) {
		.selected-card{ --items-per-row: 3; }
	}

	@media only screen and (min-width: 1264px) {
		.selected-card{ --items-per-row: 4; }
	}

	@media only screen and (min-width: 1904px) {
		.selected-card{ --items-per-row: 5; }
	}
</style>