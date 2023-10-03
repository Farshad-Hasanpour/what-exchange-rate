import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import './registerServiceWorker'

Vue.component('Icon', Icon);
Vue.component('Button', Button);

Vue.config.productionTip = false;

axios.defaults.baseURL = 'https://api.apilayer.com/exchangerates_data';
axios.defaults.headers['apikey'] = process.env.VUE_APP_API_KEY;

Vue.prototype.$http = axios;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
