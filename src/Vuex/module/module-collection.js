import { forEachValue } from "../util"
import Module from "./module"

class ModuleCollection{
    constructor(options){
        this.register([],options)
    }
    getNamespaced(path){
        // 命名空间参数就是一个字符串
        let root = this.root; // 从根模块找起
        return path.reduce((str,key)=>{ // path例如是[a/c]
            root = root.getChild(key)   // 不停地找当前的模块
            return str+(root.namespaced? key+'/' : '')  // 如 a/c
        },'')   
    }
    // 注册模块
    register(path,rootModule){
        // 将以下逻辑封装成类方便拓展

        // let newModule ={    // newModule是格式化后的结果
        //     _raw:rootModule,    // 原来的模块
        //     _children:{},       // 模块的儿子
        //     state:rootModule.state  // 当前模块的状态
        // }
        let newModule = new Module(rootModule)

        if(path.length == 0){
            // 根模块 将第一次格式化后的结果赋给根模块
            this.root = newModule
        }else{
            // [a,b,c,d] 从根节点开始找到d的父亲c 给c._children赋值d  slice(0,-1)截取从开头到倒数第一个
            // reduce 1.如果数组为空且没有提供初始值会抛出TypeError  2.如果数组仅有一个元素并且没有提供初始值 或者有提供初始值但是数组为空 那么此唯一值将被返回并且callback不会被执行
            let parent = path.slice(0,-1).reduce((memo,current)=>{
                // return memo._children[current]
                return memo.getChild(current)
            },this.root)

            // 给父亲添加子模块 取path最后一个模块名
            // parent._children[path[path.length-1]] = newModule
            parent.addChild(path[path.length-1],newModule)
        }
        // 有子模块
        if(rootModule.modules){
            // 循环模块并注册子模块 递归
            forEachValue(rootModule.modules,(module,moduleName)=>{
                this.register(path.concat(moduleName),module)
            })
        }
    }
}
export default ModuleCollection

// 格式化后的数据
// this.root = {
//     _raw: "根模块",
//     _children:{
//         a:{
//             _raw: "a模块",
//             _children:{
//                 c:{
//                     ...
//                 }
//             },
//             state:'a模块自己的状态'
//         },
//         b:{
//             _raw: "b模块",
//             _children:{
                
//             },
//             state:'b模块自己的状态'
//         }
//     },
//     state:'根模块自己的状态'
// }
