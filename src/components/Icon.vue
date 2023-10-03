<template>
	<Component
		:is="require(`!babel-loader!vue-svg-loader!../assets/icons/${name}.svg`)"
		:width="size"
		:height="size"
		:fill="color"
		:class="{'rotate': rotate, 'reverse': reverse}"
		class="icon transition300"
	/>
</template>

<script>
export default {
	name: "Icon",
	props: {
		name: { required: true, type: String },
		color: { required: false, type: String, default: 'currentColor' },
		size: { required: false, type: String, default: '24px' },
		reverse: { required: false, type: Boolean },
		rotate: { required: false, type: Boolean }
	},
}
</script>

<style scoped>
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.rotate {
	animation: rotate 1s ease-in-out infinite; /* Adjust the duration and timing function as needed */
}

.icon{
	transform: rotate(0deg);
}
.icon.reverse{
	transform: rotate(180deg);
}
</style>

