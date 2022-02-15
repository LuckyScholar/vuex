import Vue from "vue"
import Vuex from "@/Vuex"

// 引用框架的vuex
// import Vuex from "vuex"

import a from "./a"
import b from "./b"
// 1.Vue.use(Vuex) Vuex是个对象 里面有install方法
// 2.Vuex中有一个store类
// 3.混入到组件中 新增$store属性

Vue.use(Vuex) // 使用这个插件 内部会调用install方法

const store = new Vuex.Store({
    strict:true, // 严格模式 严格模式下只能通过mutations同步更改状态 其他都不行(如actions 或者直接state.xxx都会报错)
    state: {
        // 相当于data
        age: 10,
    },
    getters: {
        //计算属性
        myAge(state) {
            console.log(1)
            return state.age + 10
        },
    },
    mutations: {
        // method 同步的更改状态 参数是状态
        changeAge(state, payload) {
            state.age += payload // 更新age属性
        },
    },
    actions: {
        // 异步操作 做完将结果提交给mutations
        changeAge({ commit }, payload) {
            setTimeout(() => {
                commit("changeAge", payload)
            }, 1000)
        },
    },
    modules: {
        a,
        b,
    },
})

export default store
