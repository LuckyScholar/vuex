import c from './c'
export default {
    namespaced: true,
    state: {
        age: 111,
    },
    getters: {
        //计算属性
        myAge(state) {
            console.log(2,'state.age',state.age)
            return state.age + 10
        },
    },
    mutations: {
        changeAge(state, payload) {
            console.log("a模块---mutations")
            state.age += payload
        },
    },
    actions: {
        changeAge({ commit }, payload) {
            setTimeout(() => {
                commit("changeAge", payload)
            }, 1000)
        },
    },
    modules:{
        c
    }
}
