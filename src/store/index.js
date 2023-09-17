import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const themes = {
	light:{
		primary: '#1A237E',
		secondary: '#F1F2F6',
		success: '#4ab190',
		error: '#ef3d59',
		text: '#2c3e50',

		cardBack: '#FFF',
		line: 'rgba(0, 0, 0, .1)'
	},
	dark:{
		primary: '#7989DA',
		secondary: '#171C21',
		success: '#4ab190',
		error: '#ef3d59',
		text: 'white',

		cardBack: '#2F3841',
		line: 'rgba(255, 255, 255, .1)'
	}
};

let store = new Vuex.Store({
	strict: true,
	state: {
		width: window.innerWidth,
		rtl: false,
		themeName: 'dark',
		snackbar:{
			show: false,
			message: null,
			messageType: null,
			timeout: 10000,
			timeoutID: null
		}
	},
	getters:{
		themeColors(state){ return themes[state.themeName]; },
		smAndDown(state){ return Boolean(state.width < 960); }
	},
	mutations: {
		showMessage: function(state, snackbar){
			state.snackbar.timeoutID && clearTimeout(state.snackbar.timeoutID);  // reset timeout
			state.snackbar.timeoutID = snackbar.timeoutID;
			state.snackbar.message = snackbar.message;
			state.snackbar.messageType = snackbar.messageType;
			state.snackbar.show = true;
		},
		closeMessage: function(state){
			state.snackbar.show = false;
		},
		resize(state, width){
			state.width = width;
		},
		switchDirection(state){
			state.rtl = !state.rtl;
		},
		switchTheme(state){
			state.themeName = (state.themeName === 'light') ? 'dark' : 'light';
		}
	},
	actions: {
		showMessage(context, snackbar){
			const timeoutID = setTimeout(() => {
				context.commit('closeMessage');
			}, context.state.snackbar.timeout);
			context.commit('showMessage', {...snackbar, timeoutID});
		},
		closeMessage(context){
			context.commit('closeMessage');
		},
		resize(context, width){
			context.commit('resize', width);
		},
		switchDirection(context){
			context.commit('switchDirection');
		},
		switchTheme(context){
			context.commit('switchTheme');
		}
	},
	modules: {
	}
});

window.addEventListener("resize", function() {
	store.dispatch('resize', window.innerWidth);
});

export default store;
