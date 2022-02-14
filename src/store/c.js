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
        
    },
}
