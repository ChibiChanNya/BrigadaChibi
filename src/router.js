import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Organization from './views/Organization.vue'


Vue.use(Router);

export default new Router({
  mode: process.env.VUE_APP_HISTORY_MODE == "hash" ? "hash" : "history",
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:id',
      name: 'organization',
      component: Organization,
    }
  ]
})
