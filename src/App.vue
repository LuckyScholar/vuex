<template>
    <div id="app">
		<div>hahhaha</div>
        <div>年龄: {{this.$store.state.age}}</div>
        <div>计算属性年龄: {{this.$store.getters.myAge}}</div>
        <!-- <div>计算属性年龄: {{this.$store.getters.myAge}}</div>
        <div>计算属性年龄: {{this.$store.getters.myAge}}</div> -->
        <!-- 多次调用vuex的getters 依赖的数据不变只会触发一次 -->
        <button @click="$store.state.age++">年龄+1</button>
        <button @click="$store.commit('changeAge',10)">mutations同步更新age+10</button>
        <button @click="$store.dispatch('changeAge',20)">actions异步更新age+20</button>

	</div>
</template>

<script>
export default {
    // App组件在创建的时候也会创建一个Vue实例
    name: "App",
    mounted(){
        console.log(this.$store);
    }
}
</script>

