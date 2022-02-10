import Vue from "vue"
import App from "./App.vue"
import store from './store/index'

Vue.config.productionTip = false

new Vue({
    store,  //每个子组件中都会有一个属性$store
    render: h => h(App),
    name:'root'
}).$mount("#app")

// this.$store 给变量前面加个$表示这个是vue的内部属性