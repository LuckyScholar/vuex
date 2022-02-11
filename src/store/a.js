import c from './c'
export default {
    namespaced: true,
    state: {
        age: 111,
    },
    getters: {},
    mutations: {
        changeAge(state, payload) {
            console.log("a模块---mutations")
            state.age += payload
        },
    },
    actions: {
        changeAge({ commit }, payload) {
            setTimeout(() => {
                console.log("a模块---actions")
                commit("changeAge", payload)
            }, 1000)
        },
    },
    modules:{
        c
    }
}
