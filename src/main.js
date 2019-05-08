import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { VLazyImagePlugin } from "v-lazy-image";

Vue.config.productionTip = false;

import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueAxios, axios);
Vue.use(VLazyImagePlugin);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBWPIxMlGvzCHcz0wEvJQk4zcdwrmpj6qs',
    libraries: 'places', // This is required if you use the Autocomplete plugin
    region: 'MX',
    language: 'mx',
  },
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
