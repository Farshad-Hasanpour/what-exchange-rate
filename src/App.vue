<template>
	<div id="app-wrapper" :rtl="$store.state.rtl" :theme="$store.state.themeName">
		<div id="app">
			<Snackbar/>
			<header>
				<a href="/">
					<h1 class="m-0" style="color: var(--color-primary); line-height: 1;">What Exchange Rate</h1>
				</a>
				<div class="actions">
					<Button
						class="action-button"
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
						class="action-button"
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
						class="action-button"
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
					<!--					class="action-button"-->
					<!--					type="fab"-->
					<!--					dark-->
					<!--					height="36px"-->
					<!--					:color="themeColors.primary"-->
					<!--					title="Change Direction"-->
					<!--					@click="$store.dispatch('switchDirection')"-->
					<!--				>-->
					<!--					<Icon name="translate"/>-->
					<!--				</Button>-->
				</div>
			</header>
			<main>
				<section>
					<transition-group tag="div" id="selected-rows" name="card-fade">
						<SelectedCard
							v-for="rate in selectedRates"
							:key="rate.id"
							:title="rate.name"
							:description="rate.value"
						/>
					</transition-group>
				</section>
				<section style="flex-grow: 1">
					<div class="section-header">
						<h2 style="font-weight: normal; font-size: 1.5em; line-height: 1;">
							Exchange Rates Based on
							<span class="base-select-container">
								<select v-model="base" class="base-select-input">
									<option
										v-for="({description}, symbol) in symbols"
										:key="symbol"
										:value="symbol"
									>
										{{description}}
									</option>
								</select>
							</span>

						</h2>
					</div>
					<Table
							v-model="selected"
							:items="ratesToShow"
							:selectable="true"
							:max-select-count="4"
							:headers="headers"
							:loading="fetchingRates || fetchingSymbols"
							:actions="actions"
							@searchOnGoogle="searchOnGoogle($event)"
							@setAsBase="base=$event"
					/>
				</section>
				<footer>
					<p style="display: flex; align-items: center;">
						<span>Made with</span>
						<Icon name="heart" style="color: red; margin: 0 4px; font-size: 18px;"/>
						<span>by <a href="https://www.linkedin.com/in/farshad-hasanpour/" target="_blank" rel="noopener">Farshad Hasanpour</a></span>
					</p>
				</footer>
			</main>
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
	@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');
	@import '../node_modules/@mdi/font/css/materialdesignicons.min.css';

	:root{
		--breakpoint-mobile: 600px;
		--breakpoint-small-tablet: 960px;
		--breakpoint-large-tablet: 1264px;
		--breakpoint-desktop: 1904px;

		--animation-speed: 0.5s;
	}

	#app-wrapper[theme="light"]{
		--color-primary: #1A237E;
		--color-secondary: #F1F2F6;
		--color-success: #4ab190;
		--color-error: #ef3d59;
		--color-text: #2c3e50;

		--color-card-back: #FFF;
		--color-line: rgba(0, 0, 0, .1);

	}

	#app-wrapper[theme="dark"]{
		--color-primary: #7989DA;
		--color-secondary: #171C21;
		--color-success: #4ab190;
		--color-error: #ef3d59;
		--color-text: #FFF;

		--color-card-back: #2F3841;
		--color-line: rgba(255, 255, 255, .1);
	}

	#app-wrapper{
		font-family: Nunito, sans-serif;
		position: fixed;
		height: 100%;
		width: 100%;
		color: var(--color-text);
		background-color: var(--color-secondary);
	}

	#app-wrapper[rtl] #app{
		direction: rtl;
		text-align: right;
	}
	#app { height: 100%;}

	/* style reset */
	*{ box-sizing: border-box;}
	body{ margin: 0; padding: 0; }
	ul, li{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a,
	a:visited,
	a:active,
	a:hover,
	a:focus{
		text-decoration: none;
		color: var(--color-primary);
	}
	section{ margin-bottom: 16px; }
	header{
		width: 100%;
		padding: 0 25px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70px;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: var(--color-secondary);
		box-shadow: var(--color-line) 0px 2px 8px 0px;
		z-index: 100;
	}
	header > .actions > .action-button:not(:first-child){
		margin-inline-start: 15px;
	}
	main{
		padding-top: 20px;
		padding-left: 25px;
		padding-right: 25px;
		padding-bottom: 0;
		scroll-behavior: smooth;
		overflow-y: auto;
		margin-top: 70px;
		height: calc(100% - 70px);
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/*** Chrome Scroll ***/
	::-webkit-scrollbar {
		width: 12px;
		background: var(--color-secondary);
	}

	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
	}

	::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb:hover{
		background-color: #666;
	}
	/*** Chrome Scroll End ***/

	.section-header{
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.section-header > *:not(:last-child){
		margin-inline-end: 20px;
	}

	#selected-rows{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: stretch;
		margin-right: -10px;
		margin-left: -10px;
	}

	.card-fade-enter-active {
		transition: opacity .3s;
	}
	.card-fade-leave-active{
		opacity: 0;
		position:absolute;
	}
	.card-fade-enter, .cardfade-leave-to {
		opacity: 0;
	}
	.card-fade-move{
		transition: transform .3s;
	}

	.no-symbol-selected{
		text-align: center;
		margin-bottom: 0;
		color: var(--color-error);
	}

	.m-0{
		margin: 0;
	}

	.base-select-input{
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		outline: none;
		border: none;
		background-color: var(--color-card-back);
		color: white;
		height: 36px;
		border-radius: 4px;
		font-size: 16px;
		padding-top: 0;
		padding-bottom: 0;
		padding-left: 12px;
		padding-right: 36px;
		width: 350px;
	}
	/* Style for the arrow icon */
	.base-select-container{
		display: inline-block;
		position: relative;
	}
	.base-select-container::after {
		content: '\25BC';
		position: absolute;
		top: 50%;
		right: calc((36px - 14px) / 2);
		transform: translateY(-50%);
		font-size: 14px;
		width: 14px;
		height: 14px;
		pointer-events: none; /* Prevents clicking on the arrow */
	}

	footer{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70px;
		padding: 0 25px;
		margin-top: auto;
	}

</style>
