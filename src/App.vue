<template>
  <div id="app">
    <!-- 根据需要显示不同的布局情况 -->
    <component :is="layout"></component>
  </div>
</template>

<script>
	import BlankLayout from "./layout/BlankLayout.vue";
	import NavLayout from "./layout/NavLayout.vue";
	export default {
		name: 'App',
		props: {
			layout: {
				type: String,
				default: "nav-layout"
			}
		},
		watch: {
// 			"$route": {
// 				handler (to, from) {
// 					if(from.path) {
// 						sessionStorage.setItem("historyPath", from.path)
// 					}
// 				},
// 				deep: true
// 			}
		},
		components: {
			"nav-layout":   NavLayout,
			"blank-layout": BlankLayout
		},
		data() {
			return {
				
			};
		},
		mounted(){
			/* 
				判断是否登陆 
			*/
			let self = this
			window.app = this
			if(sessionStorage.getItem("token")) {
				// this.$message.success('你已登录', 20);
			}else{
				window.location.href = window.location.origin + "/#/login"
			}
		}
	}
</script>

<style>
	
</style>
