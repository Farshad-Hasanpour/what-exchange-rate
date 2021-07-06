<template>
	<div id="app-wrapper" :rtl="$store.state.rtl" :theme="$store.state.themeName">
		<div id="app">
			<Snackbar/>
			<header>
				<Button class="setting-button" type="fab" dark height="36px" :color="themeColors.primary" title="تغییر قالب" @click="$store.dispatch('switchTheme')">
					<Icon name="brightness-4"/>
				</Button>
				<Button class="setting-button" type="fab" dark height="36px" :color="themeColors.primary" title="تغییر جهت" @click="$store.dispatch('switchDirection')">
					<Icon name="translate"/>
				</Button>
			</header>
			<main>
				<section>
					<div class="section-header">
						<h2>کاربران انتخاب شده</h2>
					</div>
					<transition-group tag="div" id="selected-users" name="card-fade">
						<UserCard v-for="user in selectedUsers" :key="user.id" :user="user"/>
					</transition-group>
				</section>
				<section>
					<div class="section-header">
						<h2>کاربران</h2>
						<Button
								v-show="selected.length"
								type="outlined"
								width="200px"
								:color="themeColors.error"
								:loading="multiDeleting"
								@click="deleteUsers(selected, true)"
						>
							<Icon name="trash-can-outline"/>
							<span>حذف دسته جمعی</span>
						</Button>
					</div>

					<Table
							v-model="selected"
							:items="usersWithRow"
							:selectable="true"
							:max-select-count="5"
							:headers="headers"
							:loading="fetching"
							:actions="actions"
							@delete="deleteUsers($event)"
					/>
				</section>
			</main>
		</div>
	</div>

</template>

<script>
	const UserCard = () => import('@/components/UserCard');
	const Table = () => import('@/components/Table');
	const Snackbar = () => import('@/components/Snackbar');
	export default {
		name: 'App',
		components: {UserCard, Table, Snackbar},
		created(){
			this.fetchUsers();
		},
		computed:{
			themeColors(){ return this.$store.getters.themeColors},
			selectedUsers(){
				return this.users.filter(user => this.selected.includes(user.id));
			},
			usersWithRow(){
				return this.users.map((user, index) => {
					return {
						row: index+1,
						...user
					}
				});
			}
		},
		data: function(){
			return {
				server:{
					users: this.$store.state.server.users
				},
				selected: [],
				users:[],
				headers: {
					row:{title: 'ردیف', dir: 'ltr'},
					name:{title: 'نام', dir: 'ltl'},
					username:{title: 'نام کاربری', dir: 'ltr'},
					phone:{title: 'تلفن', dir: 'ltr'},
					address:{title: 'آدرس', dir: 'ltr'},
				},
				actions:{
					delete:{
						icon: 'trash-can-outline',
						title: 'حذف کاربر',
						event: 'delete',
						color: this.$store.getters.themeColors.error,
						loadingProperty: 'deleting',
					}
				},
				fetching: false,
				multiDeleting: false,
			}
		},
		methods:{
			fetchUsers(){
				this.fetching = true;
				this.$http.get(this.server.users).then(response => {
					this.users = response.data.map(user => {
						return {
							...user,
							address: `${user.address.suite}, ${user.address.street}, ${user.address.city}`,
							deleting: false,
						}
					});
				}).catch(error => {
					let message = 'خطا در دریافت کاربران از سرور';
					if(error.response && error.response.statusText) message = error.response.statusText;
					this.$store.dispatch('showMessage', {messageType: 'error', message});
				}).then(() => {
					this.fetching = false;
				});
			},
			deleteUsers(ids, multiDeleteButton=false){
				// Change to array
				if(!Array.isArray(ids)) ids = [ids];

				// set loading
				if(multiDeleteButton){
					this.multiDeleting = true;
				}else{
					this.users.find(user => user.id === ids[0]).deleting = true;
				}

				// Simulate api loading
				setTimeout(function(){
					// delete users
					this.users = this.users.filter(user => !ids.includes(user.id));
					// remove deleted users from selected list
					this.selected = this.selected.filter(id => !ids.includes(id));

					if(multiDeleteButton) this.multiDeleting = false;
				}.bind(this), 1000);
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
		justify-content: start;
		align-items: center;
	}
	.section-header > *:not(:last-child){
		margin-inline-end: 20px;
	}

	#selected-users{
		display: flex;
		flex-wrap: wrap;
		justify-content: start;
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

</style>
