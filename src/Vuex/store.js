import applyMixin from "./mixin"
import ModuleCollection from "./module/module-collection"
import { forEachValue } from "./util"

/**
 *
 * @param {*} store 容器
 * @param {*} rootState 根模块
 * @param {*} path 所有路径
 * @param {*} module 我们格式化后的结果
 */

const installModule = (store, rootState, path, module) => {
    // 将所有子模块的状态安装到父模块的状态上

    // 给当前订阅的事件 增加一个命名空间
    let namespace = store._modules.getNamespaced(path)
    // console.log('namespace',namespace);
    // namespace      根模块没有命名空间为空
    // namespace a/
    // namespace a/c/
    // namespace b/
    
    if (path.length > 0) {
        // vuex可以动态的添加模块
        // [a,c] [] 找到a要添加c 将state赋给c  得到如以下结构数据
        // {
        //     a:{
        //         age:111,
        //         c:{
        //             age:333
        //         }
        //     }
        // }
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        }, rootState)
        // 如果这个对象本身不是响应式的 用Vue.set变成响应式的
        Vue.set(parent, path[path.length - 1], module.state)
    }

    // 要对当前模块进行操作  遍历当前模块上的mutations actions gettters 都把这些方法定义在Module类上
    module.forEachMutation((mutation, key) => {
        // 有值用原来的 没值设为[]
        store._mutations[namespace+key] = store._mutations[namespace+key] || []
        // 往里面添加用户传进来的mutation函数
        store._mutations[namespace+key].push(payload => {
            // this指向对应的store实例 参数是状态state 和用户传进来的值payload
            mutation.call(store, module.state, payload)
        })
    })
    module.forEachAction((action, key) => {
        // 有值用原来的 没值设为[]
        store._actions[namespace+key] = store._actions[namespace+key] || []
        store._actions[namespace+key].push(payload => {
            action.call(store, store, payload)
        })
    })
    module.forEachGetter((getter, key) => {
        // 模块中getter的名字重复了会覆盖
        store._wrappedGetters[namespace+key] = function (state) {
            return getter(state)
        }
    })
    module.forEachChild((child, key) => {
        // 递归安装模块
        installModule(store, rootState, path.concat(key), child)
    })
}

function resetStoreVM(store,state){
    const computed = {} // 定义计算属性
    store.getters ={}   // 定义store中的getters
    forEachValue(store._wrappedGetters,(fn,key)=>{
        computed[key] = ()=>{
            return fn(store.state)
        }
        Object.defineProperty(store.getters,key,{
            get:()=>store._vm[key] // 去计算属性中取值  2.取值的时候这里才有值
        })
    })
    // 1.先走这里 让computed有值
    store._vm = new Vue({
        data:{              
            $$state: state, 

        },
        computed  //计算属性有缓存
    })

}

export let Vue // install执行Vue就有值 就拿到Vue的构造函数 就能new Store
export class Store {
    // 容器的初始化
    constructor(options) {
        // options就是你 new Vuex({state,mutation,actions})传递的参数
        const state = options.state // 数据变化要更新视图(Vue核心逻辑依赖收集)
        this._actions = {}
        this._mutations = {}
        this._wrappedGetters = {}

        // 数据的格式化 格式化成我想要的树结构
        // 1.模块收集
        this._modules = new ModuleCollection(options)
        // 根模块的状态中 要将子模块根据模块名 定义在根模块上
        // 2.安装模块
        installModule(this, state, [], this._modules.root)

        // 3.将状态和getters都定义在当前的vm上
        resetStoreVM(this,state)

        // // 响应式的数据 new Vue({data}) vuex简易流程
        // // 1.添加状态逻辑 数据在哪使用 就会收集对应的依赖
        // const computed = {}

        // // 2.处理getters属性 是有缓存的 computed带有缓存(多次取值如果值不变不会重新取值)
        // this.getters = {}
        // // Object.keys(options.getters).forEach(key=>{
        // //     Object.defineProperty(this.getters,key,{
        // //         get:()=> options.getters[key](this.state)   //将用户传进来的getters各个属性赋给this.getters 然后访问这些属性的时候进行函数调用取值
        // //     })
        // // })
        // // 简化封装成这样 第一个参数是值 第二个参数是键
        // forEachValue(options.getters, (fn,key)=>{
        //     computed[key] = ()=>{   // 将用户的getters定义在实例上 取计算属性时就是直接this.xxx获取计算属性的值
        //         return fn(this.state)
        //     }
        //     Object.defineProperty(this.getters,key,{
        //         get:()=> this._vm[key]  // 当我取值时 执行计算属性的逻辑
        //     })
        // })

        // // 3.计算属性的实现
        // this._vm = new Vue({
        //     data:{              // 属性如果是以$开头的 默认不会把这个属性挂载在vm实例上 内部属性不能被用户访问 例如$a或者$$a都不能访问
        //         $$state: state, // 会将$$state对应的对象 通过definedProperty来进行属性劫持  $$表示是vuex里面的变量

        //     },
        //     computed

        // })
        // console.log(this._vm,this._vm.$$state);   // 在vm上找不到$$state属性

        // // 4.实现mutations
        // this.mutations = {}
        // forEachValue(options.mutations,(fn,key)=>{
        //     // this.mutations = {
        //     //     changeAge:(payload)=> 用户的逻辑 (state,payload)
        //     // }
        //     this.mutations[key] = (payload)=> fn(this.state,payload)
        // })

        // // 5.实现actions
        // this.actions = {}
        // forEachValue(options.actions,(fn,key)=>{
        //     // actions的第一个参数是Store实例 this
        //     this.actions[key] = (payload)=> fn(this,payload)
        // })
    }
    // 在严格模式下 mutations和actions是有区别的
    commit = (type, payload) => {
        // 使用箭头函数是为了保证当前的this 指向当前store实例
        // 调用commit就是去找刚才绑定好的 mutations里面对应的方法
        this._mutations[type].forEach(mutation => mutation.call(this,payload))
    }
    dispatch = (type, payload) => {
        this._actions[type].forEach(action => action.call(this,payload))
    }
    get state() {
        // 属性访问器
        return this._vm._data.$$state // 内部属性Vue会放在_data这个属性上
    }
}

// Vue.ues 方法会调用插件的install方法 此方法中的参数就是Vue的构造函数

// Vue.use = function(plugin){  //这样就能获取Vue的构造函数
//     plugin.install(this) // this就是Vue
// }
export const install = _Vue => {
    // 插件的安装   Vue.use(vuex)
    // _Vue是Vue的构造函数 不需要依赖Vue的版本 2.0或者3.0都没关系  哪个版本use就是哪个版本的
    Vue = _Vue
    // 需要将根组件中注入的store 分派给每个组件(子组件) Vue.mixin
    applyMixin(Vue)
}
