import Vue from 'vue'
import GraphComponent from "./components/core/index.js"
import App from './App.vue'

Vue.use(GraphComponent)
Vue.config.productionTip = true
Vue.config.devtools = true

new Vue({
  render: h => h(App),
}).$mount('#app')
