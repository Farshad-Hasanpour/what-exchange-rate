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
axios.defaults.headers['X-RapidAPI-Key'] = 'd4a8ab7e25msh334a0266ac2fc60p1d0026jsnd9439bae5d13';
axios.defaults.headers['X-RapidAPI-Host'] = 'exchange-rate9.p.rapidapi.com';

Vue.prototype.$http = axios;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
