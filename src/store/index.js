import Vue from 'vue'
import Vuex from '@/Vuex'

// 1.Vue.use(Vuex) Vuex是个对象 里面有install方法
// 2.Vuex中有一个store类
// 3.混入到组件中 新增$store属性

Vue.use(Vuex)   // 使用这个插件 内部会调用install方法

const store = new Vuex.Store({
    state:{
        age:10
    },
    getters:{   //计算属性
        myAge(state){
            console.log(1);
            return state.age +10
        }
    }
})

export default store