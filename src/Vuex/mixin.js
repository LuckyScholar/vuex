export default function applyMixin(Vue){
    Vue.mixin({ // 内部会把生命周期函数拍平成一个数组
        beforeCreate:vuexInit
    })
}

// vuex 初始化 只做一件事 给所有的组件增加$store属性 组件的渲染是从父到子的
function vuexInit(){
    // console.log(this.$options.name,'beforeCreate'); // 执行流程 先走根组件(mian.js) 再走子组件
    // 给所有的组件增加$store属性 指向我们创建的store实例
    const options = this.$options   // 获取用户的所有选项
    // console.log('options',options);
    if(options.store){  // 有store的就是根实例
        this.$store = options.store
    }else if(options.parent && options.parent.$store){  // 儿子或者孙子组件实例
        this.$store = options.parent.$store // 将父亲的$store属性赋值给儿子
    }
}