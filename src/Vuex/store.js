import applyMixin from "./mixin"

export let Vue  // install执行Vue就有值 就拿到Vue的构造函数 就能new Store
export class Store { // 容器的初始化
    constructor(options){   // options就是你 new Vuex({state,mutation,actions})传递的参数
        const state = options.state  // 数据变化要更新视图(Vue核心逻辑依赖收集)

        // 响应式的数据 new Vue({data})
        // 1.添加状态逻辑 数据在哪使用 就会收集对应的依赖
        this._vm = new Vue({
            data:{              // 属性如果是以$开头的 默认不会把这个属性挂载在vm实例上 内部属性不能被用户访问 例如$a或者$$a都不能访问
                $$state: state, // 会将$$state对应的对象 通过definedProperty来进行属性劫持  $$表示是vuex里面的变量  

            }
            
        })
        console.log(this._vm,this._vm.$$state);   // 在vm上找不到$$state属性   

        // 2.处理getters属性 是有缓存的 computed带有缓存(多次取值如果值不变不会重新取值)
        this.getters = {}
        Object.keys(options.getters).forEach(key=>{
            Object.defineProperty(this.getters,key,{
                get:()=> options.getters[key](this.state)   //将用户传进来的getters各个属性赋给this.getters 然后访问这些属性的时候进行函数调用取值
            })
        })
    }
    get state(){    // 属性访问器 
        return this._vm._data.$$state   // 内部属性Vue会放在_data这个属性上 

    }
}

// Vue.ues 方法会调用插件的install方法 此方法中的参数就是Vue的构造函数

// Vue.use = function(plugin){  //这样就能获取Vue的构造函数
//     plugin.install(this) // this就是Vue
// }
export const install = (_Vue) => {  // 插件的安装   Vue.use(vuex) 
    // _Vue是Vue的构造函数 不需要依赖Vue的版本 2.0或者3.0都没关系  哪个版本use就是哪个版本的
    Vue= _Vue
    // 需要将根组件中注入的store 分派给每个组件(子组件) Vue.mixin
    applyMixin(Vue)
}
