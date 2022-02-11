import { forEachValue } from "../util"

class Module{
    constructor(newModule){
        this._raw = newModule,    // 原来的模块
        this._children = {},       // 模块的儿子
        this.state = newModule.state  // 当前模块的状态
    }
    getChild(key){
        return this._children[key]
    }
    addChild(key,module){
        this._children[key] = module
    }
    // 给模块继续扩展方法
    forEachMutation(fn){
        if(this._raw.mutations){
            forEachValue(this._raw.mutations,fn)
        }
    }
    forEachAction(fn){
        if(this._raw.actions){
            forEachValue(this._raw.actions,fn)
        }
    }
    forEachGetter(fn){
        if(this._raw.getters){
            forEachValue(this._raw.getters,fn)
        }
    }
    forEachChild(fn){
        if(this._children){
            forEachValue(this._children,fn)
        }
    }
}
export default Module