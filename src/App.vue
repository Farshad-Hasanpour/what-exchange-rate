<template>
	<div id="app-wrapper" :rtl="$store.state.rtl" :theme="$store.state.themeName">
		<div id="app">
			<Snackbar/>
			<header>
				<a href="/" class="website-title">
					<h1>What Exchange Rate</h1>
				</a>
				<Button
					v-bind="commonHeaderActionProps"
					class="mr-1 ml-auto"
					title="Switch Theme"
					@click="$store.dispatch('switchTheme')"
				>
					<Icon name="brightness-4"/>
				</Button>
				<a
					href="https://apilayer.com/marketplace/exchangerates_data-api"
					target="_blank"
					rel="noopener"
					class="mx-1"
				>
					<Button v-bind="commonHeaderActionProps" title="API">
						<Icon name="api"/>
					</Button>
				</a>
				<a
					href="https://github.com/Farshad-Hasanpour/what-exchange-rate"
					target="_blank"
					rel="noopener"
					class="mx-1"
				>
					<Button v-bind="commonHeaderActionProps" title="Source code">
						<Icon name="github"/>
					</Button>
				</a>
				<!--				<Button-->
				<!--					class="mx-1"-->
				<!--					type="fab"-->
				<!--					dark-->
				<!--					height="36px"-->
				<!--					:color="themeColors.primary"-->
				<!--					title="Change Direction"-->
				<!--					@click="$store.dispatch('switchDirection')"-->
				<!--				>-->
				<!--					<Icon name="translate"/>-->
				<!--				</Button>-->
			</header>
			<main>
				<transition-group v-show="selectedRates.length" tag="div" id="selected-rows" name="card-fade">
					<SelectedCard
						v-for="rate in selectedRates"
						:key="rate.id"
						:rate="rate"
						:base="base"
						:symbols="symbols"
					/>
				</transition-group>
				<h2 class="flex aic flex-wrap mx-1 my-5">
					<span class="mr-2 mb-2">Exchange Rates Based on</span>
					<span v-if="Object.keys(symbols).length" class="base-select-container relative mb-2">
						<select v-model="base" class="base-select-input">
							<option v-for="(description, symbol) in symbols" :key="symbol" :value="symbol">
								{{description}}
							</option>
						</select>
					</span>
					<span v-else>United States Dollar</span>
				</h2>
				<Table
					v-model="selected"
					:items="ratesToShow"
					:selectable="true"
					:max-select-count="4"
					:headers="headers"
					:loading="fetchingRates || fetchingSymbols"
					:actions="actions"
					class="flex-grow-1 mb-16"
					@searchOnGoogle="searchOnGoogle($event)"
					@setAsBase="base=$event"
				/>
				<footer>
					<p class="flex aic">
						<span class="mr-1">Made</span>
						<span class="xs-hidden">with</span>
						<Icon name="heart" color="red" size="18px" class="mx-1 my-0 xs-hidden"/>
						<span>by <a href="https://www.linkedin.com/in/farshad-hasanpour/" target="_blank" rel="noopener">Farshad Hasanpour</a></span>
					</p>
					<p>Foreign exchange rates published by the European Central Bank - might be outdated</p>
					<p><b>DISCLAIMER:</b> Do not use this website for financial decision making.</p>
				</footer>
			</main>
		</div>
	</div>
</template>

<script>
	const SelectedCard = () => import(/* webpackChunkName: 'selected-card' */'@/components/SelectedCard');
	const Table = () => import(/* webpackChunkName: 'table' */'@/components/Table');
	const Snackbar = () => import(/* webpackChunkName: 'snackbar' */'@/components/Snackbar');

	export default {
		name: 'App',
		components: {SelectedCard, Table, Snackbar},
		watch: {
			base: {
				immediate: true,
				handler(){
					this.fetchSymbols();
					this.fetchRates();
				}
			}
		},
		computed:{
			themeColors(){
				return this.$store.getters.themeColors
			},
			selectedRates(){
				return this.ratesToShow.filter(rate => this.selected.includes(rate.id));
			},
			commonHeaderActionProps(){
				return{
					type: 'fab',
					dark: true,
					height: "36px",
					color: this.themeColors.primary,
				}
			},
			ratesToShow(){
				return this.rates.map((rate, index) => ({
					row: index + 1,
					name: this.symbols[rate.id] || 'Loading...',
					...rate
				}));
			},
			headers(){
				return {
					row:{title: 'Row', dir: 'ltr'},
					name:{title: 'Name', dir: 'ltl', searchable: true},
					id:{title: 'Symbol', dir: 'ltr', searchable: true},
					value:{title: `Exchange Rate`, dir: 'ltr', searchable: true},
				}
			},
			actions(){
				return {
					searchOnGoogle:{
						icon: 'google',
						title: 'Search on Google',
						event: 'searchOnGoogle',
						color: this.$store.getters.themeColors.primary,
						loadingProperty: null,
					},
					setAsBase: {
						icon: 'currency-usd',
						title: 'Set as base currency',
						event: 'setAsBase',
						color: this.$store.getters.themeColors.primary,
						loadingProperty: null,
					}
				}
			}
		},
		data(){
			return {
				selected: [],
				symbols: {
					// UAE: 'United',
					// USD: 'united states',
					// EU: 'europe',
				},
				rates: [
					// {id: 'UAE', value: '10'},
					// {id: 'EU', value: '2'},
					// {id: 'USD', value: '1'}
				],
				base: 'USD',
				fetchingSymbols: false,
				fetchingRates: false,
			}
		},
		methods:{
			fetchSymbols(){
				this.fetchingSymbols = true;
				this.$http.get('/symbols').then(res => {
					this.symbols = res.data.symbols || {};
				}).catch(() => {
					const message = "We're sorry. There was an error in fetching symbols";
					this.$store.dispatch('showMessage', {messageType: 'error', message});
				}).then(() => {
					this.fetchingSymbols = false;
				});
			},
			fetchRates(){
				this.fetchingRates = true;
				this.$http.get('/latest', {
					params: {
						base: this.base,
					}
				}).then(res => {
					if(!res.data.rates) return;
					this.rates = Object.entries(res.data.rates).map(([code, value]) => {
						let formatted = value.toLocaleString('en', {style: "currency", currency: code, maximumSignificantDigits: 7});
						if(formatted.startsWith(code)) formatted = formatted.replace(code, '').trim();

						return {
							id: code,
							value: formatted,
						}
					});
				}).catch(() => {
					const message = "We're sorry. There was an error in fetching exchange rates";
					this.$store.dispatch('showMessage', {messageType: 'error', message});
				}).then(() => {
					this.fetchingRates = false;
				});
			},
			searchOnGoogle(target){
				window.open(`https://google.com/search?q=${this.base}+to+${target}`, '_blank');
			}
		}
	}
</script>

<style>
	@import "./assets/css/reset.css";
	@import "./assets/css/themes.css";
	@import "./assets/css/default.css";
	@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
</style>

<style scoped>
#selected-rows{
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: stretch;
	margin-right: -10px;
	margin-left: -10px;
	margin-top: 16px;
	margin-bottom: 48px;
}

.website-title{
	display: none;
}

.base-select-input{
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	outline: none;
	border: none;
	background-color: var(--color-card-back);
	color: var(--color-text);
	height: 42px;
	border-radius: 4px;
	font-size: 16px;
	padding-top: 0;
	padding-bottom: 0;
	padding-left: 12px;
	padding-right: 36px;
	width: 100%;
}
.base-select-container{
	min-width: 100%;
}
/* Style for the arrow icon */
.base-select-container::after {
	content: '\25BC';
	position: absolute;
	top: 50%;
	right: calc((36px - 14px) / 2);
	transform: translateY(-50%);
	font-size: 14px;
	width: 14px;
	height: 14px;
	pointer-events: none; /* Prevents clicking on the arrow */;
}

@media only screen and (min-width: 600px) {
	.website-title{
		display: inline-block;
	}
}
@media only screen and (min-width: 960px) {
	.base-select-container{
		min-width: 350px;
	}
}
</style>
