export default {
    namespaced: true,
    state: {
        age: 333,
    },
    getters: {},
    mutations: {
        changeAge(state, payload) {
            console.log("c模块---mutations")
            state.age += payload
        },
    },
    actions: {
        changeAge({ commit }, payload) {
            setTimeout(() => {
                console.log("c模块---actions")
                commit("changeAge", payload)
            }, 1000)
        },
    },
}
