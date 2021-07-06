import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

Vue.component('Icon', Icon);
Vue.component('Button', Button);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

new Vue({
    store,
    render: h => h(App)
}).$mount('#app');
