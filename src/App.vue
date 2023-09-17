<template>
	<div id="app-wrapper" :rtl="$store.state.rtl" :theme="$store.state.themeName">
		<div id="app">
			<Snackbar/>
			<header>
				<Button
					class="setting-button"
					type="fab"
					dark
					height="36px"
					:color="themeColors.primary"
					title="Switch Theme"
					@click="$store.dispatch('switchTheme')"
				>
					<Icon name="brightness-4"/>
				</Button>
<!--				<Button-->
<!--					class="setting-button"-->
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
				<section>
					<div class="section-header">
						<h2>Featured</h2>
					</div>
					<transition-group tag="div" id="selected-rows" name="card-fade">
						<SelectedCard
							v-for="rate in selectedRates"
							:key="rate.id"
							:title="rate.name"
							:description="rate.value"
						/>
					</transition-group>
					<p v-show="!selectedRates.length" class="no-symbol-selected">
						No Symbol Selected
					</p>
				</section>
				<section>
					<div class="section-header">
						<h2>Exchange Rates - {{base}}</h2>
					</div>
					<Table
							v-model="selected"
							:items="ratesToShow"
							:selectable="true"
							:max-select-count="5"
							:headers="headers"
							:loading="fetchingRates || fetchingSymbols"
							:actions="actions"
							@searchOnGoogle="searchOnGoogle($event)"
							@setAsBase="base=$event"
					/>
				</section>
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
					value:{title: `Exchange Rate By ${this.base}`, dir: 'ltr'},
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
							color: this.$store.getters.themeColors.success,
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
					this.rates = Object.entries(res.data.rates).map(([code, value]) => ({
						id: code,
						value,
					}));
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
		font-family: Shabnam, Tahoma, Arial, sans-serif;
		position: fixed;
		height: 100%;
		width: 100%;
		scroll-behavior: smooth;
		overflow-y: auto;
		color: var(--color-text);
		background-color: var(--color-secondary);
	}

	#app-wrapper[rtl] #app{
		direction: rtl;
		text-align: right;
	}
	#app { height: 100%;}

	@font-face{
		font-family: shabnam;
		src: url('./assets/fonts/shabnam/Shabnam-FD.eot');
		src: url('./assets/fonts/shabnam/Shabnam-FD.eot?#iefix') format('embedded-opentype'),
		url('./assets/fonts/shabnam/Shabnam-FD.woff') format('woff'),
		url('./assets/fonts/shabnam/Shabnam-FD.ttf') format('truetype');
		font-weight: normal;
	}

	/* style reset */
	*{ box-sizing: border-box;}
	body{ margin: 0; padding: 0; }
	ul, li{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	a{ text-decoration: none; }
	main{ padding: 20px 20px; }
	section{ margin-bottom: 16px; }
	header{
		height: 48px;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		padding: 0 25px;
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


	header > .setting-button:not(:first-child){
		margin-inline-start: 15px;
	}

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
</style>
