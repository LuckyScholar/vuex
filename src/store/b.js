export default {
    namespaced: true,
    state: {
        age: 222,
    },
    getters: {},
    mutations: {
        changeAge(state, payload) {
            console.log("b模块---mutations")
            state.age += payload
        },
    },
    actions: {
        
    },
}
