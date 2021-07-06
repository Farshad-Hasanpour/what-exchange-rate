<template>
	<div id="user-card">
		<h2 id="name">{{user.name}}</h2>
		<p id="phone">{{user.phone}}</p>
	</div>
</template>

<script>
	export default {
		name: "UserCard",
		props:{
			user: {required: true, type: Object}
		}
	}
</script>

<style scoped>
	#user-card{
		--items-per-row: 1;
		--horizontal-margin: 10px;

		width: calc((100% / var(--items-per-row)) - (2 * var(--horizontal-margin)));
		margin-bottom:20px;
		margin-left: var(--horizontal-margin);
		margin-right: var(--horizontal-margin);
		box-shadow: var(--color-line) 0px 2px 8px 0px;

		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		padding: 32px 10px;
		background-color: var(--color-card-back);
	}

	#name{ margin: 0; }
	#phone{
		margin: 0;
		font-size: 14px;
		color: darkgray;
	}

	@media only screen and (min-width: 600px) {
		#user-card{ --items-per-row: 2; }
	}

	@media only screen and (min-width: 960px) {
		#user-card{ --items-per-row: 3; }
	}

	@media only screen and (min-width: 1264px) {
		#user-card{ --items-per-row: 4; }
	}

	@media only screen and (min-width: 1904px) {
		#user-card{ --items-per-row: 5; }
	}
</style>