<template>
    <div id="app">
        <div>hahhaha</div>
        <div>年龄: {{ this.$store.state.age }}</div>
        <div>计算属性年龄: {{ this.$store.getters.myAge }}</div>
        <br>
        <!-- 辅助函数的简写 -->
        <div>辅助函数-年龄: {{ age }}</div>
        <div>辅助函数-计算属性年龄: {{ myAge }}</div>
        <br>
        <!-- <div>计算属性年龄: {{this.$store.getters.myAge}}</div>
        <div>计算属性年龄: {{this.$store.getters.myAge}}</div> -->
        <!-- 多次调用vuex的getters 依赖的数据不变只会触发一次 -->

        <!-- 模块内的计算属性未实现 -->
        <!-- <div>a模块的计算属性年龄: {{this.$store.getters['a/myAge']}}</div> -->

        <div>a模块的年龄: {{ this.$store.state.a.age }}</div>
        <div>b模块的年龄: {{ this.$store.state.b.age }}</div>
        <!-- c模块在a模块里面 去c里面state的值 要 a.c这样取值 不能直接c取值 -->
        <!-- <div>c模块的年龄: {{this.$store.state.c.age}}</div> -->
        <div>c模块的年龄: {{ this.$store.state.a.c.age }}</div>
        <br>
        <div class="module">
            <button @click="$store.state.age++">根模块年龄+1</button>
            <button @click="$store.commit('changeAge', 10)">根模块mutations同步更新age+10</button>
            <button @click="$store.dispatch('changeAge', 20)">根模块actions异步更新age+20</button>
        </div>
        <div class="module">
            <!-- 辅助函数mapMutations的简写 -->
            <button @click="changeAge(10)">根模块mutations同步更新age+10</button>
        </div>
        <div class="module">
            <button @click="$store.commit('a/changeAge', 10)">a模块mutations同步更新age+10</button>
            <!-- 模块内的dispatch未实现 模块内的state还是根模块的state-->
            <!-- <button @click="$store.dispatch('a/changeAge',20)">a模块actions异步更新age+20</button> -->
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "@/Vuex"
export default {
    // App组件在创建的时候也会创建一个Vue实例
    name: "App",
    mounted() {
        console.log(this.$store)
    },
    computed: {
        ...mapState(["age"]),
        ...mapGetters(["myAge"]),
        // 相当于
        // age(){
        //     return this.$store.state.age
        // }
    },
    methods:{
        ...mapMutations(['changeAge'])
    }
}
</script>
<style>
.module {
    margin-top: 20px;
    margin-bottom: 40px;
}
</style>
