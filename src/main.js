import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

Vue.component('Icon', Icon);
Vue.component('Button', Button);

Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://exchange-rate9.p.rapidapi.com';
//TODO: change authorization method
axios.defaults.headers['X-RapidAPI-Key'] = process.env.VUE_APP_X_RAPIDAPI_KEY;
axios.defaults.headers['X-RapidAPI-Host'] = 'exchange-rate9.p.rapidapi.com';

Vue.prototype.$http = axios;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
