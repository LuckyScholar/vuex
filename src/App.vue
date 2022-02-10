<template>
    <div id="app">
		<div>hahhaha</div>
        <div>年龄：{{this.$store.state.age}}</div>
        <div>计算属性：{{this.$store.getters.myAge}}</div>
        <button @click="$store.state.age++">年龄+1</button>
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

