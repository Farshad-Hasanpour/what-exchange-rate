<template>
	<div id="app-wrapper" :rtl="$store.state.rtl" :theme="$store.state.themeName">
		<div id="app">
			<Snackbar/>
			<header>
				<a href="/" style="margin-right: auto;">
					<h1>What Exchange Rate</h1>
				</a>
					<Button
						class="mx-1"
						type="fab"
						dark
						height="36px"
						:color="themeColors.primary"
						title="Switch Theme"
						@click="$store.dispatch('switchTheme')"
					>
						<Icon name="brightness-4"/>
					</Button>
					<a
						href="https://rapidapi.com/Serply/api/exchange-rate9/"
						target="_blank"
						rel="noopener"
						class="mx-1"
					>
						<Button
							type="fab"
							dark
							height="36px"
							:color="themeColors.primary"
							title="API"
						>
							<Icon name="api"/>
						</Button>
					</a>
					<a
						href="https://github.com/Farshad-Hasanpour/what-exchange-rate"
						target="_blank"
						rel="noopener"
						class="mx-1"
					>
						<Button
							type="fab"
							dark
							height="36px"
							:color="themeColors.primary"
							title="Source code"
						>
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
				<transition-group tag="div" id="selected-rows" name="card-fade">
					<SelectedCard
						v-for="rate in selectedRates"
						:key="rate.id"
						:title="rate.name"
						:description="rate.value"
					/>
				</transition-group>
				<h2 class="mx-1 my-5 relative">
					Exchange Rates Based on
					<select v-if="symbols.length" v-model="base" class="base-select-input">
						<option
							v-for="({description}, symbol) in symbols"
							:key="symbol"
							:value="symbol"
						>
							{{description}}
						</option>
					</select>
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
					class="flex-grow-1"
					@searchOnGoogle="searchOnGoogle($event)"
					@setAsBase="base=$event"
				/>
			</main>
			<footer>
				<p class="flex aic">
					<span>Made with</span>
					<Icon name="heart" color="red" size="18px" class="mx-1 my-0"/>
					<span>by <a href="https://www.linkedin.com/in/farshad-hasanpour/" target="_blank" rel="noopener">Farshad Hasanpour</a></span>
				</p>
				<p>Foreign exchange rates published by the European Central Bank</p>
				<p><b>DISCLAIMER:</b> Do not use this website for financial decision making.</p>
			</footer>
		</div>
	</div>
</template>

<script>
	const SelectedCard = () => import('@/components/SelectedCard');
	const Table = () => import('@/components/Table');
	const Snackbar = () => import('@/components/Snackbar');

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
			ratesToShow(){
				return this.rates.map((rate, index) => ({
					row: index + 1,
					name: this.symbols[rate.id]?.description || 'Loading...',
					...rate
				}));
			},
			headers(){
				return {
					row:{title: 'Row', dir: 'ltr'},
					name:{title: 'Name', dir: 'ltl'},
					id:{title: 'Symbol', dir: 'ltr'},
					value:{title: `Exchange Rate - 1 ${this.base}`, dir: 'ltr'},
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
				symbols: {},
				rates: [],
				base: 'USD',
				fetchingSymbols: false,
				fetchingRates: false,
			}
		},
		methods:{
			fetchSymbols(){
				this.fetchingSymbols = true;
				this.$http.get('/symbols').then(res => {
					this.symbols = res.data.symbols;
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
	@import '../node_modules/@mdi/font/css/materialdesignicons.min.css';

	#selected-rows{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: stretch;
		margin-right: -10px;
		margin-left: -10px;
	}
</style>
